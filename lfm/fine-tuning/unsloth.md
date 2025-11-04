# Unsloth

[Unsloth](https://github.com/unslothai/unsloth) is a library that makes fine-tuning LLMs 2-5x faster and uses 70% less memory through optimized kernels and efficient memory management.

:::tip
**Use Unsloth for:**
- 2-5x faster training with optimized kernels
- 70% less memory usage through efficient management
- Utilities for quantization and quick inference
:::

## Installation

Install Unsloth and required dependencies:

```
pip install "unsloth[colab-new] @ git+https://github.com/unslothai/unsloth.git"
```

For a stable release:

```
pip install unsloth transformers>=4.55.0 torch>=2.6
```

Optional: Install `xformers` for additional memory optimizations.

## Supervised Fine-Tuning (SFT)

<a href="https://colab.research.google.com/drive/1HROdGaPFt1tATniBcos11-doVaH7kOI3?usp=sharing"><img src="https://cdn-uploads.huggingface.co/production/uploads/61b8e2ba285851687028d395/vlOyMEjwHa_b_LXysEu2E.png" width="120" alt="Colab link" /></a>

Unsloth provides the `FastLanguageModel` wrapper that automatically applies optimizations to your model and integrates seamlessly with TRL's `SFTTrainer`.

### Full Fine-Tuning

```python
from unsloth import FastLanguageModel
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

# Load model with Unsloth optimizations
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="LiquidAI/LFM2-1.2B",
    max_seq_length=2048,
    dtype=None,  # Auto-detect
    load_in_4bit=False,
)

# Load your dataset
dataset = load_dataset("your-dataset")

# Configure training
training_args = SFTConfig(
    output_dir="./lfm2-unsloth-sft",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-5,
    logging_steps=10,
    save_strategy="epoch",
    bf16=True,
)

# Create trainer
trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    tokenizer=tokenizer,
)

# Train
trainer.train()
```

### LoRA Fine-Tuning

Unsloth provides optimized LoRA support through `FastLanguageModel.get_peft_model()`:

```python
from unsloth import FastLanguageModel
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

# Load model with Unsloth optimizations
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="LiquidAI/LFM2-1.2B",
    max_seq_length=2048,
    dtype=None,
    load_in_4bit=False,
)

# Apply LoRA with Unsloth
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=32,
    lora_dropout=0.05,
    bias="none",
    use_gradient_checkpointing="unsloth",  # Unsloth's optimized gradient checkpointing
    random_state=42,
)

training_args = SFTConfig(
    output_dir="./lfm2-unsloth-lora",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    logging_steps=10,
    bf16=True,
)

dataset = load_dataset("your-dataset")

trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    tokenizer=tokenizer,
)

trainer.train()
```

### QLoRA (4-Bit Quantization)

For maximum memory efficiency, use 4-bit quantized training:

```python
from unsloth import FastLanguageModel
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

# Load model in 4-bit
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="LiquidAI/LFM2-1.2B",
    max_seq_length=2048,
    dtype=None,
    load_in_4bit=True,  # Enable 4-bit quantization
)

# Apply LoRA
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=32,
    lora_dropout=0.05,
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=42,
)

training_args = SFTConfig(
    output_dir="./lfm2-unsloth-qlora",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,
    learning_rate=2e-4,
    logging_steps=10,
    bf16=True,
)

dataset = load_dataset("your-dataset")

trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    tokenizer=tokenizer,
)

trainer.train()
```

## Saving Models

After training, save your model:

```python
# Save LoRA adapters only (lightweight)
model.save_pretrained("./lfm2-lora-adapters")
tokenizer.save_pretrained("./lfm2-lora-adapters")

# Or save merged model (full weights)
model.save_pretrained_merged("./lfm2-merged", tokenizer)
```

## Inference

Load and run inference with your fine-tuned model:

```python
from unsloth import FastLanguageModel

# Load model
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="./lfm2-lora-adapters",
    max_seq_length=2048,
    dtype=None,
    load_in_4bit=False,
)

# Enable inference mode for faster generation
FastLanguageModel.for_inference(model)

# Generate
inputs = tokenizer("Your prompt here", return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=512)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))
```

## Direct Preference Optimization (DPO)

Unsloth also supports DPO training with the `DPOTrainer`:

```python
from unsloth import FastLanguageModel, PatchDPOTrainer
from trl import DPOTrainer, DPOConfig
from datasets import load_dataset

# Patch DPO for Unsloth optimizations
PatchDPOTrainer()

# Load model
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="LiquidAI/LFM2-1.2B",
    max_seq_length=2048,
    dtype=None,
    load_in_4bit=False,
)

# Apply LoRA
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
    lora_alpha=32,
    lora_dropout=0.05,
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=42,
)

# Load preference dataset
dataset = load_dataset("your-preference-dataset")

training_args = DPOConfig(
    output_dir="./lfm2-unsloth-dpo",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,
    learning_rate=5e-7,
    beta=0.1,
    logging_steps=10,
    bf16=True,
)

trainer = DPOTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    tokenizer=tokenizer,
)

trainer.train()
```

:::note
Multi-GPU support exists in Unsloth but is less clearly documented and tested than other packages like TRL or Axolotl. For production multi-GPU training, consider using TRL or Axolotl with Unsloth optimizations where available.
:::

## Tips

- **`max_seq_length`**: Set to your expected maximum sequence length; Unsloth pre-allocates memory for efficiency
- **`load_in_4bit`**: Enables QLoRA, reducing memory by ~4x with minimal quality loss
- **`use_gradient_checkpointing`**: Use `"unsloth"` for faster checkpointing than default
- **Target modules**: Include MLP layers (`gate_proj`, `up_proj`, `down_proj`) for better quality, especially on smaller models
- **Batch size**: Unsloth's optimizations allow larger batch sizes; experiment to maximize GPU utilization

---

For more end to end examples, visit the [Liquid AI Cookbook](https://github.com/Liquid4All/cookbook).
