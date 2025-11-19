# Vision Models

LFM2 includes three vision-language (VL) models optimized for multimodal tasks:

- **[LFM2-VL-3B](https://huggingface.co/LiquidAI/LFM2-VL-3B)** - Largest vision model with enhanced capabilities
- **[LFM2-VL-1.6B](https://huggingface.co/LiquidAI/LFM2-VL-1.6B)** - Mid-size model with thumbnail encoding for global context
- **[LFM2-VL-450M](https://huggingface.co/LiquidAI/LFM2-VL-450M)** - Compact model for efficient inference

## Chat Template

LFM2-VL uses a ChatML-like chat template similar to text models, with support for images:

```
<|startoftext|><|im_start|>system
You are a helpful multimodal assistant by Liquid AI.<|im_end|>
<|im_start|>user
<image>Describe this image.<|im_end|>
<|im_start|>assistant
This image shows a Caenorhabditis elegans (C. elegans) nematode.<|im_end|>
```

Images are referenced with a sentinel token (`<image>`), which is automatically replaced with the image tokens by the processor.

**Example usage:**

```python
from transformers import AutoProcessor, AutoModelForCausalLM

processor = AutoProcessor.from_pretrained("LiquidAI/LFM2-VL-1.6B")
model = AutoModelForCausalLM.from_pretrained("LiquidAI/LFM2-VL-1.6B")

messages = [
    {"role": "system", "content": "You are a helpful multimodal assistant by Liquid AI."},
    {"role": "user", "content": "<image>Describe this image."}
]

# Apply chat template with image
prompt = processor.apply_chat_template(
    messages,
    images=[your_image],  # PIL Image or numpy array
    tokenize=False
)
```

You can apply the chat template using the dedicated `.apply_chat_template()` function from Hugging Face transformers.

## Architecture

LFM2-VL models use a hybrid architecture with three language model towers (350M, 1.2B, and 2.6B) paired with SigLIP2 NaFlex vision encoders. The small encoder (86M base variant) is only used with the 350M tower, while the large encoder (400M shape-optimized variant) is used with the 1.2B and 2.6B towers.

The models handle images up to 512×512 pixels natively without upscaling and preserve non-standard aspect ratios without distortion. Large images are split into non-overlapping 512×512 patches using a tiling strategy, with thumbnail encoding for global context (in the 1.6B model). A 2-layer MLP connector with pixel unshuffle efficiently reduces image tokens.

## Generation Parameters

### Variable Resolution Encoder

LFM2-VL models feature a **user-tunable variable resolution encoder** that allows you to control the quality/speed tradeoff by determining how images are processed into tokens.

#### Image Token Management

You can control the number of image tokens through several parameters:

- **`min_image_tokens`** - Minimum number of tokens to use for image encoding
- **`max_image_tokens`** - Maximum number of tokens to use for image encoding
- **`do_image_splitting`** - Whether to split large images into patches

**How it works:**

- Images are processed into tokens by the vision encoder
- The encoder uses a tiling strategy: large images are split into non-overlapping 512×512 patches
- A 2-layer MLP connector with pixel unshuffle efficiently reduces image tokens (e.g., 256×384 image → 96 tokens, 1000×3000 → 1,020 tokens)
- By adjusting `min_image_tokens` and `max_image_tokens`, you can balance between:
  - **Higher quality**: More tokens (slower, more detailed)
  - **Faster inference**: Fewer tokens (faster, less detailed)

**Example:**
```python
# High quality (slower)
max_image_tokens=256, min_image_tokens=128

# Balanced
max_image_tokens=128, min_image_tokens=64

# Fast (lower quality)
max_image_tokens=64, min_image_tokens=32
```

### Recommended Settings

<details>
<summary>Text Generation</summary>

- `temperature=0.1`
- `min_p=0.15`
- `repetition_penalty=1.05`

</details>

<details>
<summary>Vision Processing</summary>

- `min_image_tokens=64`
- `max_image_tokens=256`
- `do_image_splitting=True`

</details>
