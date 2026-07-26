export type QueryLibrary = Readonly<{
  query(request: unknown): Promise<unknown>;
}>;
