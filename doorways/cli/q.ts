#!/usr/bin/env node
import fs from "node:fs";
import process from "node:process";
import { startsQueryEngine } from "../../composition-root/starts-query-engine.js";
import { invokesQueryEngine } from "./invokes-query-engine.js";
import { readsCommandArguments } from "./reads-command-arguments.js";
import { writesCommandResult } from "./writes-command-result.js";

const argumentsValue = readsCommandArguments(process.argv.slice(2));
const sources = argumentsValue.dataPath === undefined
  ? {}
  : JSON.parse(fs.readFileSync(argumentsValue.dataPath, "utf8")) as Readonly<Record<string, readonly Readonly<Record<string, unknown>>[]>>;
const { engine } = startsQueryEngine({ capabilityPacks: [], portAdapters: {} });

Promise.resolve(invokesQueryEngine(engine, argumentsValue.commandText, sources))
  .then((result) => writesCommandResult({ write: (value) => process.stdout.write(value) }, result))
  .catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  });
