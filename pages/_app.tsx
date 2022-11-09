import { AppProps } from "next/app";
import { trpc } from "src/utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ReactQueryDevtools initialIsOpen={false} />
      <Component {...pageProps} />
    </>
  );
}

export default trpc.withTRPC(MyApp);
