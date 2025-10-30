# Liquid Documentation

## Local Development

```sh
npm install
npm run dev
```

The local server will be available at `http://localhost:3000`.

## Deployment

The deployment is automated through Vercel.

| Branch       | Domain                          |
| ------------ | ------------------------------- |
| `main`       | https://docs-staging.liquid.ai/ |
| `production` | https://docs.liquid.ai/         |

To promote the `main` branch to `production`, run the [`deploy-main.yaml`](https://github.com/Liquid4All/docs/actions/workflows/deploy-main.yaml) GitHub action, which will automatically fast-forward the `production` branch to match `main`.

## LICENSE

[LFM Open License v1.0](./LICENSE)
