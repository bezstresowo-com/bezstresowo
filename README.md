# bezstresowo.org

[![Netlify Status](https://api.netlify.com/api/v1/badges/22ddfc27-a96c-43d5-a7e2-bee82035821d/deploy-status)](https://app.netlify.com/projects/bezstresowo/deploys)

[Admin Auth](./ADMIN_AUTH.md)

## Things to know about this repo

- use `Node 24.7` with `npm 11.5`
- to start the project just run `npm run dev`

- for complex ui elements use [bits-ui](https://bits-ui.com/docs/components)
- for icons use [fontawesome](https://fontawesome.com/v7/search?ic=free&o=r) - we have all the v7 free icons.
  > WARNING: Remember that `<i class="..."></i>` unwraps into an svg element so to avoid hydration issues wrap these with a `<div></div>` or other neutral elements when used standalone in control flow statements, like `{#if ...}{/if}`
- [tailwind](https://tailwindcss.com/docs/) for styling
- [yup](https://github.com/jquense/yup) and [`import { createForm } from 'svelte-forms-lib'`](https://svelte-forms-lib-sapper-docs.vercel.app/) for forms validation
- for translations use the `$translate` derivation from the `i18n` store (locale specific translations held in the `i18n/translations` dir)
