import faunadb, { query } from "faunadb";

export const client = new faunadb.Client({
  secret: process.env.FAUNA_SERVER_SECRET || "",
});
export const q = query;
export { faunadb };

export async function handleFaunaResponse<
  T extends object,
  E extends object = object
>(request: Promise<FaunaResult<T, E>>) {
  try {
    const result = await request;
    if (Array.isArray(result)) {
      throw new Error(result[0].description);
    }
    return result;
  } catch (err) {
    if ("description" in err && "requestResult" in err) {
      throw new Error(err.description);
    }
    throw err;
  }
}

type FaunaError = [{ code: string; description: string }];
type FaunaResponse<T, E> = E & { ref: faunadb.values.Ref; ts: number; data: T };
export type FaunaResult<T extends object, E extends object> =
  | FaunaResponse<T, E>
  | FaunaError;
