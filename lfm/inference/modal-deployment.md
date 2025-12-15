# Modal Deployment

All the source code is available in this repository: https://github.com/Liquid4All/lfm-inference/tree/main

## Use `vLLM` docker image

You can use the `vLLM` docker image `vllm/vllm-openai` to deploy LFM.

Launch command:

```sh
cd modal

# deploy LFM2 8B MoE model
modal deploy deploy-vllm-docker.py

# deploy other LFM2 model, MODEL_NAME defaults to LiquidAI/LFM2-8B-A1B
MODEL_NAME=LiquidAI/<model-slug> modal deploy deploy-vllm-docker.py
```

See full list of open source LFM models on [Hugging Face](https://huggingface.co/collections/LiquidAI/lfm2).

> [!NOTE]
> This is the recommended approach for production deployment.

## Use `vLLM` PyPI package

Alternatively, you can also use the `vLLM` PyPI package to deploy LFM. This approach is based on the Modal [example](https://modal.com/docs/examples/vllm_inference) for deploying OpenAI-compatible LLM service with vLLM, with a few modifications.

Launch command:

```sh
cd modal

# deploy LFM2 8B MoE model
modal deploy deploy-vllm-pypi.py

# deploy any LFM2 model, MODEL_NAME defaults to LiquidAI/LFM2-8B-A1B
MODEL_NAME=LiquidAI/<model-slug> modal deploy deploy-vllm-pypi.py
```

<details>
<summary>(Click to see detailed modifications)</summary>

- Change the `MODEL_NAME` and `MODEL_REVISION` to the latest LFM model.
  - E.g. for[`LFM2-8B-A1B`](https://huggingface.co/LiquidAI/LFM2-8B-A1B):
    - `MODEL_NAME = "LiquidAI/LFM2-8B-A1B"`
    - `MODEL_REVISION = "6df6a75822a5779f7bf4a21e765cb77d0383935d"`
- Optionally, turn off `FAST_BOOT`.
- Optionally, add these environment variables:
  - `HF_XET_HIGH_PERFORMANCE=1`,
  - `VLLM_USE_V1=1`,
  - `VLLM_USE_FUSED_MOE_GROUPED_TOPK=0`.
- Optionally, add these launch arguments:
  - `--dtype bfloat16`
  - `--gpu-memory-utilization 0.6`
  - `--max-model-len 32768`
  - `--max-num-seqs 600`
  - `--compilation-config '{\"cudagraph_mode\": \"FULL_AND_PIECEWISE\"}'`
</details>

## Production deployment

- Prefer the `deploy-vllm-docker.py` script.
- Since vLLM takes over 2 min to cold start, if you run the inference server for production, it is recommended to keep a minimum number of warm instances with `min_containers = 1` and `buffer_containers = 1`. The `buffer_containers` config is necessary because all Modal GPUs are subject to [preemption](https://modal.com/docs/guide/preemption). See [docs](https://modal.com/docs/guide/cold-start#overprovision-resources-with-min_containers-and-buffer_containers) for details about cold start performance tuning.
- Warm up the vLLM server after deployment by sending a single request. The warm-up process is included in the [deploy-vllm-docker.py](https://github.com/Liquid4All/lfm-inference/blob/main/modal/deploy-vllm-docker.py) script already.

## Test commands

Test the deployed server with the following `curl` commands (replace `<modal-deployment-url>` with your actual deployment URL):

```sh
# List deployed model
curl https://<modal-deployment-url>/v1/models

# Query the deployed LFM model
curl https://<modal-deployment-url>/v1/chat/completions \
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
