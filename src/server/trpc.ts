import { Context } from "./context";
import { initTRPC } from "@trpc/server";

const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;
