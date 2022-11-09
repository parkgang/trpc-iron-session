import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getIronSession } from "iron-session";
import { sessionOptions } from "lib/session";

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const session = await getIronSession(opts.req, opts.res, sessionOptions);

  return {
    session,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
