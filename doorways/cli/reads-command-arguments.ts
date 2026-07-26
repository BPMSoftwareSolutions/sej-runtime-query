export type CommandArguments = Readonly<{
  commandText: string;
}>;

export function readsCommandArguments(argumentsList: readonly string[]): CommandArguments {
  return Object.freeze({ commandText: argumentsList.join(" ") });
}
