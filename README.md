# Liquid Documentation

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

The `npm run serve` script does not support hot loading.

## Link check

The [`check.yaml`](./.github/workflows/check.yaml) workflow has a `check-link` job that examine markdown links. Customize the config in [`link-check.json`](./link-check.json). If a link cannot be accessed (e.g. Github private repo), add the URL pattern to the `ignorePatterns` array.

## Deployment

The deployment is automated through Vercel.

| Branch       | Domain                          |
| ------------ | ------------------------------- |
| `production` | https://docs.liquid.ai         |
| `main`       | https://liquidai-main.mintlify.app |

To promote the `main` branch to `production`, run the [`deploy-main.yaml`](https://github.com/Liquid4All/docs/actions/workflows/deploy-main.yaml) GitHub action, which will automatically fast-forward the `production` branch to match `main`.

## LICENSE

[Attribution-ShareAlike 4.0 International](./LICENSE)
