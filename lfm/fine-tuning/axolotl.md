# Axolotl

[Axolotl](https://github.com/axolotl-ai-cloud/axolotl) is a YAML-driven fine-tuning toolkit that simplifies training with support for SFT, LoRA, QLoRA, DPO, and multi-GPU training.

:::tip
**Use Axolotl for:**
- YAML-based configuration for reproducible training
- Multi-GPU training with DeepSpeed or FSDP
- Production-ready training pipelines
:::

## Quick Start
1. Install Axolotl
2. Create a YAML config file
3. Run `axolotl train config.yml`
4. Run `axolotl inference config.yml` or `axolotl merge-lora config.yml`

<a href="https://colab.research.google.com/drive/155lr5-uYsOJmZfO6_QZPjbs8hA_v8S7t?usp=sharing"><img src="https://cdn-uploads.huggingface.co/production/uploads/61b8e2ba285851687028d395/vlOyMEjwHa_b_LXysEu2E.png" width="120" alt="Colab link" /></a>

## Installation

### Requirements

- NVIDIA Ampere+ GPU (or AMD ROCm GPU)
- Python ≥ 3.10
- PyTorch compatible with your CUDA/ROCm version

### Install from PyPI
```
pip install --no-build-isolation "axolotl[flash-attn,deepspeed]"
```

### Install from Source
```
git clone https://github.com/axolotl-ai-cloud/axolotl
cd axolotl
pip install -e '.[flash-attn,deepspeed]'
```

For detailed installation instructions, see the [official Axolotl installation guide](https://docs.axolotl.ai/docs/installation.html).

## Dataset Formats

Axolotl supports multiple dataset formats for supervised fine-tuning. We recommend either **OpenAI Messages** or **Input/Output**.

### OpenAI Messages Format

`data/lfm2_sft.jsonl`:

```json
{"messages":[{"role":"user","content":"Write a short haiku about LFM2."},{"role":"assistant","content":"Silent layers learn\nTokens drift like falling leaves\nLFM2 speaks."}]}
{"messages":[{"role":"system","content":"You are a helpful assistant."},{"role":"user","content":"Summarize Axolotl in one sentence."},{"role":"assistant","content":"Axolotl is a YAML‑driven LLM finetuning toolkit."}]}
```

YAML (snippet):

```yaml
datasets:
  - path: data/lfm2_sft.jsonl
    type: chat_template       # use tokenizer chat template
    field_messages: messages  # key in your JSON objects
```

> Tip: the LFM2 tokenizer **includes a chat template** in `tokenizer_config.json` which you can use

### Input/Output Format

`data/lfm2_io.jsonl`:

```json
{"input": "User question...", "output": "Assistant answer..."}
```

YAML (snippet):

```yaml
datasets:
  - path: data/lfm2_io.jsonl
    type: input_output
train_on_inputs: false   # mask inputs when computing loss
```

## Training Configurations

Below are example YAML configurations for different training scenarios.

### LoRA Fine-Tuning

`configs/lfm2-2.6b-lora.yml`:

```yaml
# ---- Model ----
base_model: LiquidAI/LFM2-2.6B
adapter: lora                  # LoRA; omit for full fine‑tune

# ---- Data ----
datasets:
  - path: data/lfm2_sft.jsonl
    type: chat_template
    field_messages: messages

# Optional: preprocess & cache
# dataset_prepared_path: .cache/lfm2_sft_prepared

# ---- Training ----
output_dir: ./outputs/lfm2-2.6b-sft-lora
num_epochs: 2
learning_rate: 2e-4
lr_scheduler: cosine
warmup_steps: 50
micro_batch_size: 2
gradient_accumulation_steps: 16
seed: 42

# ---- Sequence & packing ----
sequence_len: 4096
sample_packing: true
pad_to_sequence_len: true

# ---- Precision & memory ----
bf16: true
flash_attention: true
gradient_checkpointing: true

# ---- LoRA hyperparams ----
lora_r: 16
lora_alpha: 32
lora_dropout: 0.05
# lora_target_modules: [q_proj,k_proj,v_proj,o_proj,gate_proj,up_proj,down_proj]  # override only if needed

# ---- Logging ----
# wandb_project: lfm2-sft
# wandb_run_name: lfm2-2.6b-lora
```

### QLoRA (4-Bit Quantization)

`configs/lfm2-2.6b-qlora.yml`:

```yaml
base_model: LiquidAI/LFM2-2.6B
adapter: lora

# 4‑bit loading for QLoRA
load_in_4bit: true
bnb_4bit_quant_type: nf4
bnb_4bit_use_double_quant: true
bnb_4bit_compute_dtype: bfloat16

# Data & training same as LoRA example
sequence_len: 4096
sample_packing: true
bf16: true
flash_attention: true
gradient_checkpointing: true

lora_r: 64
lora_alpha: 32
lora_dropout: 0.05

output_dir: ./outputs/lfm2-2.6b-sft-qlora
num_epochs: 2
learning_rate: 2e-4
micro_batch_size: 2
gradient_accumulation_steps: 16
```

### Full Fine-Tuning

`configs/lfm2-2.6b-full.yml`:

```yaml
base_model: LiquidAI/LFM2-2.6B
# adapter: null   # no PEFT adapters -> full FT

sequence_len: 4096
sample_packing: true
bf16: true
flash_attention: true
gradient_checkpointing: true

output_dir: ./outputs/lfm2-2.6b-sft-full
num_epochs: 2
learning_rate: 1e-5
lr_scheduler: cosine
warmup_steps: 50
micro_batch_size: 1
gradient_accumulation_steps: 32
```

> **Notes**
>
> - Tune `sequence_len`, `micro_batch_size`, and `gradient_accumulation_steps` to your GPU budget.
> - If you hit OOM with long contexts, consider **sequence parallelism** (multi‑GPU) and keep `flash_attention: true`.

## Training

### Single GPU

Run training with your YAML config:

```bash
axolotl train configs/lfm2-2.6b-lora.yml
```

Debug preprocessing to inspect tokens:

```bash
axolotl preprocess configs/lfm2-2.6b-lora.yml --debug --debug-num-examples 5
```

### Multi-GPU with DeepSpeed

```bash
# Fetch DeepSpeed configs (one-time setup)
axolotl fetch deepspeed_configs

# Train with DeepSpeed ZeRO-2
axolotl train configs/lfm2-2.6b-lora.yml --deepspeed deepspeed_configs/zero2.json

# Or use torchrun launcher
axolotl train configs/lfm2-2.6b-lora.yml --launcher torchrun -- --nproc_per_node=4
```

### Multi-GPU with FSDP

For FSDP2, set `fsdp_version: 2` and configure `fsdp_config` in your YAML file.

## Inference

### LoRA Inference

```bash
axolotl inference configs/lfm2-2.6b-lora.yml \
  --lora-model-dir ./outputs/lfm2-2.6b-sft-lora
```

### Full Model Inference

```bash
axolotl inference configs/lfm2-2.6b-full.yml \
  --base-model ./outputs/lfm2-2.6b-sft-full/completed
```

### Merging LoRA Adapters

Merge LoRA adapters into the base model:

```bash
axolotl merge-lora configs/lfm2-2.6b-lora.yml \
  --lora-model-dir ./outputs/lfm2-2.6b-sft-lora
```

For CPU-only merging (if VRAM is limited):

```bash
CUDA_VISIBLE_DEVICES="" axolotl merge-lora configs/lfm2-2.6b-lora.yml
```

## Pushing to Hugging Face

### Manual Upload

```bash
hf login
hf upload <your-org>/<repo-name> ./outputs/lfm2-2.6b-sft-lora/merged
```

### Automatic Upload

Set `hub_model_id: <your-org>/<repo>` in your YAML config to auto-push during training (requires `hf login` first).

## Tips

- **Out of memory**: Reduce `micro_batch_size`, increase `gradient_accumulation_steps`, lower `sequence_len`, or use QLoRA
- **Slow training**: Enable `flash_attention`, `sample_packing`, and `gradient_checkpointing`
- **LoRA optimizations**: Add `lora_mlp_kernel: true`, `lora_qkv_kernel: true`, `lora_o_kernel: true` for faster training
- **Merge errors**: Use CPU merge with `CUDA_VISIBLE_DEVICES=""` or set `lora_on_cpu: true`
- **Multi-GPU**: Start with DeepSpeed ZeRO-2, upgrade to ZeRO-3 for larger models

---

For more end to end examples, visit the [Liquid AI Cookbook](https://github.com/Liquid4All/cookbook).
