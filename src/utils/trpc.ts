import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
// ℹ️ Type-only import: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export
import type { AppRouter } from "src/server/routers/_app";

function getBaseUrl() {
  // 브라우저는 상대 경로를 사용해야 합니다: 해당 코드가 있어야 Client Side에서 서빙되는 도메인으로 요청이 됩니다
  if (typeof window !== "undefined") {
    return "";
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        // 개발 중인 콘솔에 예쁜 로그를 추가하고 프로덕션에서 오류를 기록합니다.
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (ctx?.req) {
              /**
               * SSR을 제대로 사용하려면 클라이언트의 헤더를 서버로 전달해야 합니다.
               * 이는 SSR시 쿠키와 같은 것을 전달할 수 있도록 하기 위한 것입니다.
               * 해당 작업을 진행하지 않으면 SSR시 쿠키가 전달되지 않음으로 SSR에서 쿠키 값으로 사용자 정보를 SSR 굽는 등 iron-session 처리를 할 수 없습니다.
               * 햇갈리면 안되는 것은 해당 작업은 SSR시 처리를 위함이며 해당 코드가 없다고 해서 Client Side에서 호출되는 tRPC가 iron-session 처리를 못한다는 것이 아닙니다.
               * @see [가져온 코드 Origin](https://trpc.io/docs/v10/ssr)
               */
              const { connection: _connection, ...headers } = ctx.req.headers;
              return {
                ...headers,
              };
            }
            return {};
          },
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            // react-query 옵션 설정 방법 예제 추가하는 겸 재시도 계속하면 디버깅 힘들어서 설정
            retry: 1,
          },
        },
      },
    };
  },
  ssr: true,
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
