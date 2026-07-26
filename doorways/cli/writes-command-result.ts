export type CommandResultWriter = Readonly<{
  write(value: string): void;
}>;

export function writesCommandResult(writer: CommandResultWriter, result: unknown): void {
  writer.write(`${JSON.stringify(result, null, 2)}\n`);
}
