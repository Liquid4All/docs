# TRL

[TRL](https://github.com/huggingface/trl) (Transformer Reinforcement Learning) is a library for fine-tuning and aligning language models using methods like Supervised Fine-Tuning (SFT), Reward Modeling, and Direct Preference Optimization (DPO).

:::tip
**Use TRL for:**
- Native integration in the Hugging Face ecosystem
- Many trained with SFT, DPO, PPO, GRPO
- Most recent training algorithms and techniques
:::

LFM models work out-of-the-box with TRL without requiring any custom integration.

## Installation

Install TRL and required dependencies:

```
pip install trl>=0.9.0 transformers>=4.55.0 torch>=2.6 peft accelerate
```

- **`trl`**: Core training library
- **`peft`**: LoRA/QLoRA support
- **`accelerate`**: Multi-GPU and distributed training

## Supervised Fine-Tuning (SFT)

<a href="https://colab.research.google.com/drive/1j5Hk_SyBb2soUsuhU0eIEA9GwLNRnElF?usp=sharing"><img src="https://cdn-uploads.huggingface.co/production/uploads/61b8e2ba285851687028d395/vlOyMEjwHa_b_LXysEu2E.png" width="120" alt="Colab link" /></a>

The `SFTTrainer` makes it easy to fine-tune LFM models on instruction-following or conversational datasets. It handles chat templates, packing, and dataset formatting automatically.

### Full Fine-Tuning

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

# Load model and tokenizer
model = AutoModelForCausalLM.from_pretrained(
    "LiquidAI/LFM2-1.2B",
    torch_dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("LiquidAI/LFM2-1.2B")

# Load your dataset
dataset = load_dataset("your-dataset")

# Configure training
training_args = SFTConfig(
    output_dir="./lfm2-sft",
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

For memory-efficient fine-tuning, use LoRA with the `SFTTrainer`:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import SFTTrainer, SFTConfig
from peft import LoraConfig
from datasets import load_dataset

model = AutoModelForCausalLM.from_pretrained(
    "LiquidAI/LFM2-1.2B",
    torch_dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("LiquidAI/LFM2-1.2B")

# Configure LoRA
peft_config = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    task_type="CAUSAL_LM",
)

training_args = SFTConfig(
    output_dir="./lfm2-sft-lora",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,
    bf16=True,
)

dataset = load_dataset("your-dataset")

trainer = SFTTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    tokenizer=tokenizer,
    peft_config=peft_config,
)

trainer.train()
```

## Direct Preference Optimization (DPO)

<a href="https://colab.research.google.com/drive/1MQdsPxFHeZweGsNx4RH7Ia8lG8PiGE1t?usp=sharing"><img src="https://cdn-uploads.huggingface.co/production/uploads/61b8e2ba285851687028d395/vlOyMEjwHa_b_LXysEu2E.png" width="120" alt="Colab link" /></a>

The `DPOTrainer` implements Direct Preference Optimization, a method to align models with human preferences without requiring a separate reward model. DPO works with preference pairs (chosen vs. rejected responses).

### Full DPO Training

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import DPOTrainer, DPOConfig
from datasets import load_dataset

# Load model and tokenizer
model = AutoModelForCausalLM.from_pretrained(
    "LiquidAI/LFM2-1.2B",
    torch_dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("LiquidAI/LFM2-1.2B")

# Load preference dataset
# Dataset should have "prompt", "chosen", and "rejected" columns
dataset = load_dataset("your-preference-dataset")

# Configure DPO training
training_args = DPOConfig(
    output_dir="./lfm2-dpo",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,
    learning_rate=5e-7,
    beta=0.1,  # DPO temperature parameter
    logging_steps=10,
    bf16=True,
)

# Create trainer
trainer = DPOTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    tokenizer=tokenizer,
)

# Train
trainer.train()
```

### DPO with LoRA

For memory-efficient DPO training:

```python
from transformers import AutoModelForCausalLM, AutoTokenizer
from trl import DPOTrainer, DPOConfig
from peft import LoraConfig
from datasets import load_dataset

model = AutoModelForCausalLM.from_pretrained(
    "LiquidAI/LFM2-1.2B",
    torch_dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("LiquidAI/LFM2-1.2B")

peft_config = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    task_type="CAUSAL_LM",
)

training_args = DPOConfig(
    output_dir="./lfm2-dpo-lora",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,
    learning_rate=5e-7,
    beta=0.1,
    bf16=True,
)

dataset = load_dataset("your-preference-dataset")

trainer = DPOTrainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    tokenizer=tokenizer,
    peft_config=peft_config,
)

trainer.train()
```

## Other Training Methods

TRL also provides additional trainers that work seamlessly with LFM models:

- **RewardTrainer**: Train reward models for RLHF
- **PPOTrainer**: Proximal Policy Optimization for reinforcement learning from human feedback
- **ORPOTrainer**: Odds Ratio Preference Optimization, an alternative to DPO
- **KTOTrainer**: Kahneman-Tversky Optimization for alignment

Refer to the [TRL documentation](https://huggingface.co/docs/trl) for detailed guides on these methods.

## Tips

- **Learning Rates**: SFT typically uses higher learning rates (1e-5 to 5e-5) than DPO (1e-7 to 1e-6)
- **Batch Size**: DPO requires larger effective batch sizes; increase `gradient_accumulation_steps` if GPU memory is limited
- **LoRA Ranks**: Start with `r=16` for experimentation; increase to `r=64` or higher for better quality
- **DPO Beta**: The `beta` parameter controls the deviation from the reference model; typical values range from 0.1 to 0.5

---

For more end to end examples, visit the [Liquid AI Cookbook](https://github.com/Liquid4All/cookbook).
