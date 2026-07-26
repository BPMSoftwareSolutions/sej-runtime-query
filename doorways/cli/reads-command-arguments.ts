export type CommandArguments = Readonly<{
  commandText: string;
  dataPath?: string;
}>;

export function readsCommandArguments(argumentsList: readonly string[]): CommandArguments {
  const dataIndex = argumentsList.indexOf("--data");
  const dataPath = dataIndex < 0 ? undefined : argumentsList[dataIndex + 1];
  const commandParts = argumentsList.filter((_, index) => dataIndex < 0 || (index !== dataIndex && index !== dataIndex + 1));
  return Object.freeze({
    commandText: commandParts.join(" "),
    ...(dataPath === undefined ? {} : { dataPath }),
  });
}
