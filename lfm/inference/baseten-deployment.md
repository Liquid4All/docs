# Baseten deployment

All the source code is available in this repository: https://github.com/Liquid4All/lfm-inference/tree/main

## Deployment

The deployment script is based on Baseten's [documentation](https://docs.baseten.co/examples/vllm) of `Run any LLM with vLLM`.

Launch command:

```sh
cd basten
pip install truss
truss push lfm2-8b --publish
```

## Test call

```sh
curl -X POST https://<model-id>.api.baseten.co/environments/production/predict \
  -H "Authorization: Api-Key $BASETEN_API_KEY" \
  -d '{
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

:::note

Baseten endpoints expect the `Api-Key` prefix in the `Authorization` header.

:::
