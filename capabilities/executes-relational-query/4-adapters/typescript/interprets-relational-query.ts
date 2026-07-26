import {
  executeRelationalQuery,
  SemanticKernelError,
  type JsonObject,
  type JsonValue,
  type RelationalExpression,
  type RelationalJoin,
  type RelationalOrder,
  type RelationalQueryPlan,
  type RelationalSelection,
  type RelationalSources,
} from "@deterministic-solutions/semantic-kernel";
import {
  requiresJsonObject,
  requiresRecord,
  requiresString,
} from "../../../../composition-root/shared/creates-capability-runtime.js";

type Token = Readonly<{ text: string; upper: string; kind: "word" | "number" | "string" | "symbol" }>;

const aliasStopKeywords = new Set([
  "FROM", "WHERE", "GROUP", "HAVING", "ORDER", "LIMIT", "OFFSET",
  "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "CROSS", "ON", "ASC", "DESC",
]);
const binaryOperators = new Map<string, Readonly<{ precedence: number; operator: Extract<RelationalExpression, { kind: "binary" }>["operator"] }>>([
  ["OR", { precedence: 1, operator: "or" }],
  ["AND", { precedence: 2, operator: "and" }],
  ["=", { precedence: 3, operator: "equals" }],
  ["==", { precedence: 3, operator: "equals" }],
  ["<>", { precedence: 3, operator: "not-equals" }],
  ["!=", { precedence: 3, operator: "not-equals" }],
  [">", { precedence: 3, operator: "greater-than" }],
  [">=", { precedence: 3, operator: "greater-than-or-equal" }],
  ["<", { precedence: 3, operator: "less-than" }],
  ["<=", { precedence: 3, operator: "less-than-or-equal" }],
  ["LIKE", { precedence: 3, operator: "like" }],
  ["IN", { precedence: 3, operator: "in" }],
  ["+", { precedence: 4, operator: "add" }],
  ["-", { precedence: 4, operator: "subtract" }],
  ["*", { precedence: 5, operator: "multiply" }],
  ["/", { precedence: 5, operator: "divide" }],
  ["%", { precedence: 5, operator: "modulo" }],
]);
const functions = new Map<string, Extract<RelationalExpression, { kind: "call" }>["function"]>([
  ["COUNT", "count"],
  ["SUM", "sum"],
  ["AVG", "average"],
  ["MIN", "minimum"],
  ["MAX", "maximum"],
  ["LOWER", "lower"],
  ["UPPER", "upper"],
  ["LENGTH", "length"],
  ["COALESCE", "coalesce"],
]);

export function observesExecutesRelationalQueryFacts(payload: JsonObject): JsonObject {
  const commandText = requiresString(payload.commandText, "Command text is required.");
  const sources = readsSources(payload.sources);
  try {
    const plan = parsesRelationalQuery(commandText);
    const requiredSources = collectsSourceIds(plan);
    const missingSources = requiredSources.filter((sourceId) => sources[sourceId] === undefined && plan.ctes[sourceId] === undefined);
    return Object.freeze({
      queryParsed: true,
      missingSources,
      missingSourceCount: missingSources.length,
      hasJoin: plan.joins.length > 0,
      hasGrouping: plan.groupBy.length > 0,
      hasCte: Object.keys(plan.ctes).length > 0,
    }) as JsonObject;
  } catch {
    return Object.freeze({
      queryParsed: false,
      missingSources: [],
      missingSourceCount: 0,
      hasJoin: false,
      hasGrouping: false,
      hasCte: false,
    }) as JsonObject;
  }
}

export function executesRelationalQueryMechanics(
  payload: JsonObject,
  decision: JsonValue,
): JsonObject {
  const plan = parsesRelationalQuery(requiresString(payload.commandText, "Command text is required."));
  const queryResult = executeRelationalQuery(plan, readsSources(payload.sources));
  return Object.freeze({ payload, decision, plan, queryResult }) as unknown as JsonObject;
}

export function parsesRelationalQuery(commandText: string): RelationalQueryPlan {
  return new RelationalParser(tokenizes(commandText)).parse();
}

function readsSources(value: unknown): RelationalSources {
  const record = requiresRecord(value, "Sources must be an object.");
  return Object.freeze(Object.fromEntries(Object.entries(record).map(([sourceId, rows]) => {
    if (!Array.isArray(rows)) {
      throw new SemanticKernelError("RELATIONAL_SOURCE_ROWS_REQUIRED", `Source ${sourceId} must contain an array.`);
    }
    return [sourceId, Object.freeze(rows.map((row) => requiresJsonObject(row, `Rows in source ${sourceId} must be objects.`)))];
  })));
}

function tokenizes(text: string): readonly Token[] {
  const pattern = /\s*(?:(--[^\r\n]*)|('(?:''|[^'])*')|("(?:""|[^"])*")|(\d+(?:\.\d+)?)|(<=|>=|<>|!=|==|[+*/%=<>(){},.;-])|([A-Za-z_][A-Za-z0-9_$]*))/g;
  const matches = [...text.matchAll(pattern)];
  const state = matches.reduce<Readonly<{ offset: number; tokens: readonly Token[] }>>((current, match) => {
    if (match.index !== current.offset) {
      throw new SemanticKernelError("RELATIONAL_QUERY_TOKEN_INVALID", `Unexpected query text at offset ${current.offset}.`, { offset: current.offset });
    }
    if (match[1] !== undefined) {
      return Object.freeze({ offset: match.index + match[0].length, tokens: current.tokens });
    }
    const raw = match[2] ?? match[3] ?? match[4] ?? match[5] ?? match[6]!;
    const kind: Token["kind"] = match[2] !== undefined
      ? "string"
      : match[3] !== undefined || match[6] !== undefined
        ? "word"
        : match[4] !== undefined
          ? "number"
          : "symbol";
    return Object.freeze({
      offset: match.index + match[0].length,
      tokens: Object.freeze([...current.tokens, Object.freeze({ text: raw, upper: raw.toUpperCase(), kind })]),
    });
  }, Object.freeze({ offset: 0, tokens: Object.freeze([]) }));
  if (text.slice(state.offset).trim().length > 0) {
    throw new SemanticKernelError("RELATIONAL_QUERY_TOKEN_INVALID", `Unexpected query text at offset ${state.offset}.`, { offset: state.offset });
  }
  return state.tokens;
}

class RelationalParser {
  #index = 0;

  public constructor(private readonly tokens: readonly Token[]) {}

  public parse(): RelationalQueryPlan {
    const ctes = this.current()?.upper === "WITH" ? this.parsesCtes() : {};
    const plan = this.parsesSelect(ctes);
    this.matches(";");
    this.requiresEnd();
    return plan;
  }

  private parsesCtes(): Readonly<Record<string, RelationalQueryPlan>> {
    this.expects("WITH");
    const parsesNext = (): Readonly<Record<string, RelationalQueryPlan>> => {
      const name = this.expectsWord().text;
      this.matches("AS");
      this.expects("(");
      const nestedTokens = this.readsParenthesizedTokens();
      const plan = new RelationalParser(nestedTokens).parse();
      return this.matches(",") ? { [name]: plan, ...parsesNext() } : { [name]: plan };
    };
    return Object.freeze(parsesNext());
  }

  private parsesSelect(ctes: Readonly<Record<string, RelationalQueryPlan>>): RelationalQueryPlan {
    this.expects("SELECT");
    const distinct = this.matches("DISTINCT");
    const selections = this.parsesSelections();
    const from = this.matches("FROM") ? this.parsesSource() : undefined;
    const joins = from === undefined ? [] : this.parsesJoins();
    const where = this.matches("WHERE") ? this.parsesExpression() : undefined;
    const groupBy = this.matches("GROUP") ? this.parsesGroupBy() : [];
    const having = this.matches("HAVING") ? this.parsesExpression() : undefined;
    const orderBy = this.matches("ORDER") ? this.parsesOrderBy() : [];
    const limit = this.matches("LIMIT") ? this.expectsInteger() : undefined;
    const offset = this.matches("OFFSET") ? this.expectsInteger() : 0;
    return Object.freeze({
      planType: "relational-query-plan.v1",
      ctes,
      ...(from === undefined ? {} : { from }),
      joins: Object.freeze(joins),
      ...(where === undefined ? {} : { where }),
      groupBy: Object.freeze(groupBy),
      ...(having === undefined ? {} : { having }),
      selections: Object.freeze(selections),
      distinct,
      orderBy: Object.freeze(orderBy),
      offset,
      ...(limit === undefined ? {} : { limit }),
    });
  }

  private parsesSelections(): readonly RelationalSelection[] {
    const parsesNext = (): readonly RelationalSelection[] => {
      const expression = this.parsesExpression();
      const explicitAlias = this.matches("AS") ? this.expectsWord().text : undefined;
      const implicitAlias = explicitAlias === undefined && this.canReadAlias() ? this.expectsWord().text : undefined;
      const alias = explicitAlias ?? implicitAlias;
      const selection = Object.freeze({ expression, ...(alias === undefined ? {} : { alias }) });
      return this.matches(",") ? [selection, ...parsesNext()] : [selection];
    };
    return parsesNext();
  }

  private parsesSource(): Readonly<{ sourceId: string; alias: string }> {
    const sourceId = this.expectsWord().text;
    const explicitAlias = this.matches("AS") ? this.expectsWord().text : undefined;
    const implicitAlias = explicitAlias === undefined && this.canReadAlias() ? this.expectsWord().text : undefined;
    return Object.freeze({ sourceId, alias: explicitAlias ?? implicitAlias ?? sourceId });
  }

  private parsesJoins(): readonly RelationalJoin[] {
    const kind = this.readsJoinKind();
    if (kind === undefined) return [];
    const source = this.parsesSource();
    const on = kind === "cross" ? undefined : this.expectsThenParses("ON");
    const join = Object.freeze({ kind, source, ...(on === undefined ? {} : { on }) });
    return [join, ...this.parsesJoins()];
  }

  private readsJoinKind(): RelationalJoin["kind"] | undefined {
    if (this.matches("JOIN")) return "inner";
    if (this.matches("INNER")) return this.expectsJoinThen("inner");
    if (this.matches("LEFT")) return this.expectsJoinThen("left");
    if (this.matches("RIGHT")) return this.expectsJoinThen("right");
    if (this.matches("FULL")) return this.expectsJoinThen("full");
    if (this.matches("CROSS")) return this.expectsJoinThen("cross");
    return undefined;
  }

  private expectsJoinThen(kind: RelationalJoin["kind"]): RelationalJoin["kind"] {
    this.matches("OUTER");
    this.expects("JOIN");
    return kind;
  }

  private expectsThenParses(keyword: string): RelationalExpression {
    this.expects(keyword);
    return this.parsesExpression();
  }

  private parsesGroupBy(): readonly RelationalExpression[] {
    this.expects("BY");
    return this.parsesExpressionList();
  }

  private parsesOrderBy(): readonly RelationalOrder[] {
    this.expects("BY");
    const parsesNext = (): readonly RelationalOrder[] => {
      const expression = this.parsesExpression();
      const direction = this.readsOrderDirection();
      const order = Object.freeze({ expression, direction } as const);
      return this.matches(",") ? [order, ...parsesNext()] : [order];
    };
    return parsesNext();
  }

  private readsOrderDirection(): RelationalOrder["direction"] {
    if (this.matches("DESC")) return "descending";
    this.matches("ASC");
    return "ascending";
  }

  private parsesExpressionList(): readonly RelationalExpression[] {
    const expression = this.parsesExpression();
    return this.matches(",") ? [expression, ...this.parsesExpressionList()] : [expression];
  }

  private parsesExpression(minimumPrecedence = 0): RelationalExpression {
    const left = this.parsesUnary();
    return this.parsesBinaryTail(left, minimumPrecedence);
  }

  private parsesBinaryTail(left: RelationalExpression, minimumPrecedence: number): RelationalExpression {
    if (this.current()?.upper === "IS") {
      this.expects("IS");
      const negated = this.matches("NOT");
      this.expects("NULL");
      return this.parsesBinaryTail(
        Object.freeze({ kind: "unary", operator: negated ? "is-not-null" : "is-null", operand: left }),
        minimumPrecedence,
      );
    }
    const declaration = binaryOperators.get(this.current()?.upper ?? "");
    if (declaration === undefined || declaration.precedence < minimumPrecedence) return left;
    this.#index += 1;
    const right = declaration.operator === "in"
      ? this.parsesInList()
      : this.parsesExpression(declaration.precedence + 1);
    return this.parsesBinaryTail(
      Object.freeze({ kind: "binary", operator: declaration.operator, left, right }),
      minimumPrecedence,
    );
  }

  private parsesInList(): RelationalExpression {
    this.expects("(");
    const items = this.parsesExpressionList();
    this.expects(")");
    return Object.freeze({ kind: "list", items: Object.freeze(items) });
  }

  private parsesUnary(): RelationalExpression {
    if (this.matches("NOT")) return Object.freeze({ kind: "unary", operator: "not", operand: this.parsesUnary() });
    if (this.matches("-")) return Object.freeze({ kind: "unary", operator: "negate", operand: this.parsesUnary() });
    return this.parsesPrimary();
  }

  private parsesPrimary(): RelationalExpression {
    if (this.matches("(")) {
      const expression = this.parsesExpression();
      this.expects(")");
      return expression;
    }
    if (this.matches("*")) return Object.freeze({ kind: "wildcard" });
    const token = this.current();
    if (token === undefined) throw this.syntaxError("Expected expression.");
    if (token.kind === "string") {
      this.#index += 1;
      return Object.freeze({ kind: "literal", value: token.text.slice(1, -1).replace(/''/g, "'") });
    }
    if (token.kind === "number") {
      this.#index += 1;
      return Object.freeze({ kind: "literal", value: Number(token.text) });
    }
    if (token.upper === "NULL" || token.upper === "TRUE" || token.upper === "FALSE") {
      this.#index += 1;
      return Object.freeze({ kind: "literal", value: token.upper === "NULL" ? null : token.upper === "TRUE" });
    }
    const word = this.expectsWord();
    if (this.matches("(")) return this.parsesCall(word);
    const path = this.parsesReferenceTail([word.text]);
    return path.at(-1) === "*"
      ? Object.freeze({ kind: "wildcard", ...(path.at(-2) === undefined ? {} : { qualifier: path.at(-2)! }) })
      : Object.freeze({ kind: "reference", path });
  }

  private parsesCall(functionToken: Token): RelationalExpression {
    const functionName = functions.get(functionToken.upper);
    if (functionName === undefined) {
      throw this.syntaxError(`Function is not declared: ${functionToken.text}.`);
    }
    const distinct = this.matches("DISTINCT");
    const argumentsList = this.matches(")") ? [] : this.parsesCallArguments();
    return Object.freeze({
      kind: "call",
      function: functionName,
      arguments: Object.freeze(argumentsList),
      ...(distinct ? { distinct: true } : {}),
    });
  }

  private parsesCallArguments(): readonly RelationalExpression[] {
    const expression = this.parsesExpression();
    if (this.matches(",")) return [expression, ...this.parsesCallArguments()];
    this.expects(")");
    return [expression];
  }

  private parsesReferenceTail(path: readonly string[]): readonly string[] {
    if (!this.matches(".")) return path;
    const segment = this.matches("*") ? "*" : this.expectsWord().text;
    return this.parsesReferenceTail([...path, segment]);
  }

  private readsParenthesizedTokens(): readonly Token[] {
    const start = this.#index;
    const readsEnd = (index: number, depth: number): number => {
      const token = this.tokens[index];
      if (token === undefined) throw this.syntaxError("Unclosed CTE query.");
      if (token.text === ")" && depth === 0) return index;
      return readsEnd(index + 1, depth + (token.text === "(" ? 1 : token.text === ")" ? -1 : 0));
    };
    const end = readsEnd(start, 0);
    this.#index = end + 1;
    return this.tokens.slice(start, end);
  }

  private canReadAlias(): boolean {
    const token = this.current();
    return token?.kind === "word" && !aliasStopKeywords.has(token.upper);
  }

  private expectsInteger(): number {
    const token = this.current();
    if (token?.kind !== "number" || !Number.isInteger(Number(token.text))) {
      throw this.syntaxError("Expected a non-negative integer.");
    }
    this.#index += 1;
    return Number(token.text);
  }

  private expectsWord(): Token {
    const token = this.current();
    if (token?.kind !== "word") throw this.syntaxError("Expected an identifier.");
    this.#index += 1;
    return token.text.startsWith('"')
      ? Object.freeze({ ...token, text: token.text.slice(1, -1).replace(/""/g, '"') })
      : token;
  }

  private expects(text: string): void {
    if (!this.matches(text)) throw this.syntaxError(`Expected ${text}.`);
  }

  private matches(text: string): boolean {
    if (this.current()?.upper !== text.toUpperCase()) return false;
    this.#index += 1;
    return true;
  }

  private current(): Token | undefined {
    return this.tokens[this.#index];
  }

  private requiresEnd(): void {
    if (this.current() !== undefined) throw this.syntaxError(`Unexpected token ${this.current()!.text}.`);
  }

  private syntaxError(message: string): SemanticKernelError {
    return new SemanticKernelError("RELATIONAL_QUERY_UNPARSABLE", message, {
      tokenIndex: this.#index,
      token: this.current()?.text ?? null,
    });
  }
}

function collectsSourceIds(plan: RelationalQueryPlan): readonly string[] {
  return Object.freeze([
    ...(plan.from === undefined ? [] : [plan.from.sourceId]),
    ...plan.joins.map((join) => join.source.sourceId),
    ...Object.values(plan.ctes).flatMap(collectsSourceIds),
  ]);
}
