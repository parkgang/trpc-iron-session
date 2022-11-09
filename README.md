# trpc-iron-session

[`English`](./README.md) | [한국어(KR)](./README.ko.md)

Secure your tRPC based on `iron-session` authentication.

The project structure is based on [iron-session examples next.js-typescript][project-structure-based]

Changed the `HTTP API` part to `tRPC` without changing the project structure as much as possible.

Thanks to this, if you pour [iron-session examples next.js-typescript][project-structure-based] here as it is, it will `diff` so you can easily see the changes.

> that the `SSG` page in the example is meaningless because of the `SSR` option of `tRPC`. 🙄

## Start

```shell
npm i
npm run dev
```

## Core

### Forwarding SSR Cookies

If you are logged in through `SSR` , you may want to quickly display user information in the `<Header />` .

To do this, you need to pass cookies to tRPC during SSR.

Please refer to [src/utils/trpc.ts](./src/utils/trpc.ts) for the related code.

### Passing iron-session value to tRPC Context

If you are familiar with `iron-session`, we will use the `req.session` to manipulate cookies.

`tRPC` must be passed as a `Context` to achieve this.

Please refer to [src/server/context.ts](./src/server/context.ts) for the related code.

## Reference

[Projects used for scaffolding][project-structure-based]

[project-structure-based]: https://github.com/vvo/iron-session/blob/main/examples/next.js-typescript/README.md
