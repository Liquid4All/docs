# Fal Deployment

All the source code is available in this repository: https://github.com/Liquid4All/lfm-inference/tree/main

## Deployment

```sh
# run one-off server
fal run deploy-lfm2.py::serve

# run production server
fal deploy deploy-lfm2.py::serve --app-name lfm2-8b --auth private
```

The first run will require extra time to download the docker image and model weights.

## Test call

First, create an API key [here](https://fal.ai/dashboard/keys).

Then run the following cURL commands:

```sh
export FAL_API_KEY=<your-fal-api-key>

# List deployed model
curl https://fal.run/<org-id>/<app-id>/v1/models -H "Authorization: Key $FAL_API_KEY"

# Query the deployed LFM model
curl -X POST https://fal.run/<org-id>/<app-id>/v1/chat/completions \
  -H "Authorization: Key $FAL_API_KEY" \
  --json '{
  "model": "LiquidAI/LFM2-8B-A1B",
  "messages": [
    {
      "role": "user",
      "content": "What is the melting temperature of silver?"
    }
  ],
  "max_tokens": 32,
  "temperature": 0
}'
```

> [!NOTE]
> Note that Fal endpoints expect the `Key` prefix in the `Authorization` header.
