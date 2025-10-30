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

## Search

Currently, the search function is powered by `@cmfcmf/docusaurus-search-local`.

> [!NOTE]
> Search only works for the statically built documentation (i.e., after running `npm run build` under the repo root).
> It does not work in development (i.e., when running `npm run dev`). To test search locally, first build the documentation with `npm run build build`, and then serve it with `npm run serve`.

## Deployment

The deployment is automated through Vercel.

| Branch       | Domain                          |
| ------------ | ------------------------------- |
| `main`       | https://docs-staging.liquid.ai/ |
| `production` | https://docs.liquid.ai/         |

To promote the `main` branch to `production`, run the [`deploy-main.yaml`](https://github.com/Liquid4All/docs/actions/workflows/deploy-main.yaml) GitHub action, which will automatically fast-forward the `production` branch to match `main`.

## LICENSE

[LFM Open License v1.0](./LICENSE)
