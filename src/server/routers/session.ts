import { router, publicProcedure } from "src/server/trpc";
import { z } from "zod";
import { User } from "lib/session";
import { Octokit } from "octokit";
import type { Endpoints } from "@octokit/types";
import { TRPCError } from "@trpc/server";

const octokit = new Octokit();
export type Events =
  Endpoints["GET /users/{username}/events"]["response"]["data"];

export const sessionRouter = router({
  user: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session.user) {
      return {
        ...ctx.session.user,
        isLoggedIn: true,
      };
    } else {
      return {
        isLoggedIn: false,
        login: "",
        avatarUrl: "",
      };
    }
  }),
  event: publicProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    if (!user || user.isLoggedIn === false) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    try {
      const { data: events } =
        await octokit.rest.activity.listPublicEventsForUser({
          username: user.login,
        });

      return events;
    } catch (error) {
      return [];
    }
  }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { username } = input;

      try {
        const {
          data: { login, avatar_url },
        } = await octokit.rest.users.getByUsername({ username });

        const user = { isLoggedIn: true, login, avatarUrl: avatar_url } as User;
        ctx.session.user = user;
        await ctx.session.save();
        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: (error as Error).message,
        });
      }
    }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    ctx.session.destroy();
    return { isLoggedIn: false, login: "", avatarUrl: "" };
  }),
});
