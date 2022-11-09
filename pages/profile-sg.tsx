import React from "react";
import Layout from "components/Layout";
import { trpc } from "src/utils/trpc";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { useRouter } from "next/router";

// Make sure to check https://nextjs.org/docs/basic-features/layouts for more info on how to use layouts
export default function SgProfile() {
  const router = useRouter();

  const userQuery = trpc.session.user.useQuery(undefined, {
    /**
     * NOTE: 꼭 사용자 정보 쿼리가 사용자 정보가 없는 경우 로그인 페이지로 리디렉션 시켜야하는 것은 아닙니다.
     * `<Header />` 와 같이 모든 페이지에서 호출되긴 하는데 정보가 없으면 없는데로 사용하는 경우가 있기 때문입니다.
     */
    onSuccess(data) {
      if (data.isLoggedIn === false) {
        router.push("/login");
      }
    },
  });
  const eventQuery = trpc.session.event.useQuery(undefined, {
    // 사용자가 로그인한 경우에만 수행합니다.
    enabled: userQuery.data?.isLoggedIn,
  });

  const user = userQuery.data;
  const events = eventQuery.data;

  return (
    <Layout>
      <h1>Your GitHub profile</h1>
      <h2>
        This page uses{" "}
        <a href="https://nextjs.org/docs/basic-features/pages#static-generation-recommended">
          Static Generation (SG)
        </a>{" "}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        and the <a href="/api/user">/api/user</a> route (using{" "}
        <a href="https://github.com/vercel/swr">vercel/SWR</a>)
      </h2>
      {user && (
        <>
          <p style={{ fontStyle: "italic" }}>
            Public data, from{" "}
            <a href={`https://github.com/${user.login}`}>
              https://github.com/{user.login}
            </a>
            , reduced to `login` and `avatar_url`.
          </p>

          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}

      {events !== undefined && (
        <p>
          Number of GitHub events for user: <b>{events.length}</b>.{" "}
          {events.length > 0 && (
            <>
              Last event type: <b>{events[0].type}</b>
            </>
          )}
        </p>
      )}
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
},
sessionOptions);
