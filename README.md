# Liquid Documentation

## Docs

| Doc | Directory | Sidebar |
| --- | --- | --- |
| LFM | [lfm](./lfm) | [`sidebarsLfm.ts`](./sidebarsLfm.ts) |
| LEAP | [leap](./leap) | [`sidebarsLeap.ts`](./sidebarsLeap.ts) |
| Examples | [examples](./examples) | [`sidebarsExamples.ts`](./sidebarsExamples.ts) |

## Local Development

```sh
npm install
npm run dev
```

The local server will be available at `http://localhost:3000`.

To test the build:

```sh
npm run build
npm run serve
```

The `npm run serve` script does not support hot loading. It is only useful to test the local search function.

## Search

Currently, the search function is powered by `@cmfcmf/docusaurus-search-local`.

> [!NOTE]
> Search only works for the statically built documentation (i.e., after running `npm run build` under the repo root).
> It does not work in development (i.e., when running `npm run dev`). To test search locally, first build the documentation with `npm run build build`, and then serve it with `npm run serve`.

## Link check

There are two link checks in this repo:

- Docusaurus will throw error for any broken as configured by `onBrokenLinks` in [`docusaurus.config.ts`](./docusaurus.config.ts). If the broken build is annoying for preview, change it to `warn`.
- The [`check.yaml`](./.github/workflows/check.yaml) workflow has a `check-link` job that examine markdown links. Customize the config in [`link-check.json`](./link-check.json). If a link cannot be accessed (e.g. Github private repo), add the URL pattern to the `ignorePatterns` array.

## Deployment

The deployment is automated through Vercel.

| Branch       | Domain                          |
| ------------ | ------------------------------- |
| `main`       | https://docs-staging.liquid.ai/ |
| `production` | https://docs.liquid.ai/         |

To promote the `main` branch to `production`, run the [`deploy-main.yaml`](https://github.com/Liquid4All/docs/actions/workflows/deploy-main.yaml) GitHub action, which will automatically fast-forward the `production` branch to match `main`.

## LICENSE

[LFM Open License v1.0](./LICENSE)
