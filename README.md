# Bug Reproduction

next.js issue: https://github.com/vercel/next.js/issues/67591
next-yak issue: https://github.com/jantimon/next-yak/issues/112

## Versions Tested:

- 14.2.4
- 15.0.0-canary.59

## Steps to reproduce

```bash
yarn dev
yarn run v1.22.19
$ next dev
  ▲ Next.js 14.2.4
  - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 1491ms
 ⨯ ./src/app/page.tsx?./page.yak.module.css
Error: 
  × You are attempting to export "metadata" from a component marked with "use client", which is disallowed. Either remove the export, or the "use client" directive. Read more: https://nextjs.org/
  │ docs/getting-started/react-essentials#the-use-client-directive
  │ 
  │ 
   ╭─[/Users/jannicklas/Desktop/repo-yak-meta-data/src/app/page.tsx:2:1]
 2 │ import { Button } from "./button";
 3 │ import { styled } from "next-yak";
 4 │ import __styleYak from "./page.yak.module.css!=!./page?./page.yak.module.css";
 5 │ export const metadata: Metadata = {
   ·              ────────
 6 │   title: '...'
 7 │ };
 8 │ const Title =
   ╰────

Import trace for requested module:
./src/app/page.tsx?./page.yak.module.css
 ```

Removing the title from `page.tsx` fixes the issue.

```tsx
const Title = styled.h1`
  color: blue;
`;
```

That's interesting because `page.tsx` imports `button.tsx` which is also compiled into a virtual css module
from a server component.

 It looks like the error is caused by [`react_server_components.rs`](https://github.com/vercel/next.js/blob/8f93430080f1c18b3f25a0b9c842063f6dc9c9e8/packages/next-swc/crates/next-custom-transforms/src/transforms/react_server_components.rs#L738-L749) of **next-custom-transforms**.  

 The reason seems to be that the virtual css module `./src/app/page.tsx?./page.yak.module.css` is compiled as a server component although it is a css module file.
