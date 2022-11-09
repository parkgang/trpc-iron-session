import React, { useState } from "react";
import Layout from "components/Layout";
import Form from "components/Form";
import { trpc } from "src/utils/trpc";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";

export default function Login() {
  const router = useRouter();

  const login = trpc.session.login.useMutation({
    onSuccess() {
      router.push("/profile-sg");
    },
    onError(err) {
      setErrorMsg(err.message);
    },
  });

  const [errorMsg, setErrorMsg] = useState("");

  return (
    <Layout>
      <div className="login">
        <Form
          errorMessage={errorMsg}
          onSubmit={async function handleSubmit(event) {
            event.preventDefault();

            const body = {
              username: event.currentTarget.username.value,
            };

            login.mutate({ username: body.username });
          }}
        />
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </Layout>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user;

  if (user) {
    return {
      redirect: {
        destination: "/profile-sg",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
},
sessionOptions);
