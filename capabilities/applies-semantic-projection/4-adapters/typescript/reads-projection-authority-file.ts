import { readFile, realpath } from "node:fs/promises";
import path from "node:path";

export type ReadProjectionAuthorityFileRequest = Readonly<{
  workspaceRoot: string;
  authorityPath: string;
}>;

export async function readsProjectionAuthorityFile(
  request: ReadProjectionAuthorityFileRequest,
): Promise<unknown> {
  const workspaceRoot = await realpath(request.workspaceRoot);
  const candidate = path.resolve(workspaceRoot, request.authorityPath);
  const authorityPath = await realpath(candidate);
  const relative = path.relative(workspaceRoot, authorityPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Projection authority path escapes the workspace root: ${request.authorityPath}`);
  }
  const content = await readFile(authorityPath, "utf8");
  return JSON.parse(content) as unknown;
}
