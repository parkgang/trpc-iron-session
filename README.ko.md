# trpc-iron-session

[English](./README.md) | [`한국어(KR)`](./README.ko.md)

`iron-session` 인증을 기반으로 `tRPC` 를 보호합니다.

[iron-session examples next.js-typescript][project-structure-based] 프로젝트를 기반으로 구축되었습니다.

프로젝트 구조를 최대한 바꾸지 않고 `HTTP API` 부분을 `tRPC` 로 변경했습니다.

덕분에 해당 리포에 [iron-session examples next.js-typescript][project-structure-based]를 그대로 넣으면 `diff` 가 되어 변경 사항을 쉽게 확인할 수 있습니다.

> 예제의 `SSG` 페이지는 `tRPC` 의 `SSR` 옵션 때문에 의미가 없어졌습니다. 🙄

## Start

```shell
npm i
npm run dev
```

## Core

### SSR에 Cookies 전달하기

`SSR` 을 통해서 로그인한 사용자의 경우 `<Header />` 부분에 사용자 정보를 빠르게 표시하고 싶을 수 있습니다.

이렇게 하려면 `SSR` 동안 `tRPC` 에게 쿠키를 전달해야 합니다.

관련 코드는 [src/utils/trpc.ts](./src/utils/trpc.ts) 를 참고해주세요.

### `tRPC` Context에 `iron-session` 값 전달

`iron-session` 에 익숙하다면 알겠지만 `req.session` 을 사용하여 쿠키를 조작합니다.

이를 위해서 `tRPC` 는 `Context` 로 값을 전달해야 합니다.

관련 코드는 [src/server/context.ts](./src/server/context.ts) 를 참고해주세요.

## Reference

[해당 프로젝트를 기반으로 스케폴드 진행][project-structure-based]

[project-structure-based]: https://github.com/vvo/iron-session/blob/main/examples/next.js-typescript/README.md
