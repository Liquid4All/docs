---
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Models

The LFM model collection includes general-purpose language models, vision-language models, task-specific models, and audio models across various parameter sizes.

- These models are built on the backbone of a new hybrid architecture that's designed for incredibly fast training and inference. Learn more in our [blog post](https://www.liquid.ai/blog/liquid-foundation-models-v2-our-second-series-of-generative-ai-models).
- All models support a **32k token text context length** for extended conversations and document processing.
- Our models are compatible with various open-source deployment libraries including [Transformers](../inference/transformers.md), [llama.cpp](../inference/llama-cpp.md), [vLLM](../inference/vllm.md), [MLX](../inference/mlx.md), [Ollama](../inference/ollama.md), and our own edge deployment platform [LEAP](../frameworks/leap.md).

<details>
<summary><strong>Complete Model Table</strong></summary>

<table className="model-matrix-table" style={{width: '100%', textAlign: 'center'}}>
<thead>
<tr style={{backgroundColor: 'rgba(124, 58, 237, 0.15)', borderTop: '2px solid #7C3AED', borderBottom: '3px solid #7C3AED'}}>
<th style={{textAlign: 'left', fontWeight: 700, padding: '0.75rem', fontSize: '1.1em'}}>Model</th>
<th style={{fontWeight: 700, padding: '0.75rem', fontSize: '1.1em'}}>HF</th>
<th style={{fontWeight: 700, padding: '0.75rem', fontSize: '1.1em'}}>GGUF</th>
<th style={{fontWeight: 700, padding: '0.75rem', fontSize: '1.1em'}}>MLX</th>
<th style={{fontWeight: 700, padding: '0.75rem', fontSize: '1.1em'}}>ONNX</th>
<th style={{fontWeight: 700, padding: '0.75rem', fontSize: '1.1em'}}>Trainable?</th>
</tr>
</thead>
<tbody>
<tr>
<td colSpan="6" style={{textAlign: 'left', fontWeight: 600, backgroundColor: 'var(--color-background-secondary)'}}><strong>LFM2 Text Models</strong></td>
</tr>
<tr>
<td colSpan="6" style={{textAlign: 'center', fontWeight: 500, backgroundColor: 'rgba(34, 197, 94, 0.08)', padding: '0.3rem', fontSize: '0.85em'}}>LFM2.5 Models (Latest Release)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2.5-1.2B-Instruct</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2.5-1.2B-Base</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-1.2B-Base" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-1.2B-Base-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-1.2B-Base-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2.5-1.2B-JP</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-1.2B-JP" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-1.2B-JP-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-1.2B-JP-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td colSpan="6" style={{textAlign: 'center', fontWeight: 500, backgroundColor: 'rgba(124, 58, 237, 0.05)', padding: '0.3rem', fontSize: '0.85em'}}>LFM2 Models</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-8B-A1B</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-8B-A1B" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-8B-A1B-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/mlx-community/LFM2-8B-A1B-8bit" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-2.6B</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-2.6B" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-2.6B-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/mlx-community/LFM2-2.6B-8bit" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/onnx-community/LFM2-2.6B-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-1.2B</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-1.2B" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-1.2B-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/mlx-community/LFM2-1.2B-8bit" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/onnx-community/LFM2-1.2B-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-700M</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-700M" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-700M-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/mlx-community/LFM2-700M-8bit" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/onnx-community/LFM2-700M-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-350M</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-350M" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-350M-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/mlx-community/LFM2-350M-8bit" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/onnx-community/LFM2-350M-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td colSpan="6" style={{textAlign: 'left', fontWeight: 'bold', backgroundColor: 'var(--color-background-secondary)'}}><strong>LFM2-VL Models</strong></td>
</tr>
<tr>
<td colSpan="6" style={{textAlign: 'center', fontWeight: 500, backgroundColor: 'rgba(34, 197, 94, 0.08)', padding: '0.3rem', fontSize: '0.85em'}}>LFM2.5 Models (Latest Release)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2.5-VL-1.6B</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-VL-1.6B" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-VL-1.6B-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-VL-1.6B-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td colSpan="6" style={{textAlign: 'center', fontWeight: 500, backgroundColor: 'rgba(124, 58, 237, 0.05)', padding: '0.3rem', fontSize: '0.85em'}}>LFM2 Models</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-VL-3B</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-VL-3B" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-VL-3B-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/mlx-community/LFM2-VL-3B-8bit" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-VL-1.6B</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-VL-1.6B" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-VL-1.6B-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/mlx-community/LFM2-VL-1.6B-8bit" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-VL-450M</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-VL-450M" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-VL-450M-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/mlx-community/LFM2-VL-450M-8bit" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td colSpan="6" style={{textAlign: 'left', fontWeight: 'bold', backgroundColor: 'var(--color-background-secondary)'}}><strong>LFM2-Audio</strong></td>
</tr>
<tr>
<td colSpan="6" style={{textAlign: 'center', fontWeight: 500, backgroundColor: 'rgba(34, 197, 94, 0.08)', padding: '0.3rem', fontSize: '0.85em'}}>LFM2.5 Models (Latest Release)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2.5-Audio-1.5B</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2.5-Audio-1.5B" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td style={{color: '#ef4444'}}>✗</td>
<td style={{color: '#ef4444'}}>✗</td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td colSpan="6" style={{textAlign: 'center', fontWeight: 500, backgroundColor: 'rgba(124, 58, 237, 0.05)', padding: '0.3rem', fontSize: '0.85em'}}>LFM2 Models</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-Audio-1.5B</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-Audio-1.5B" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-Audio-1.5B-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td style={{color: '#ef4444'}}>✗</td>
<td>No</td>
</tr>
<tr>
<td colSpan="6" style={{textAlign: 'left', fontWeight: 'bold', backgroundColor: 'var(--color-background-secondary)'}}><strong>Liquid Nanos</strong></td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-1.2B-Extract</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-1.2B-Extract" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-1.2B-Extract-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td><a href="https://huggingface.co/onnx-community/LFM2-1.2B-Extract-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-350M-Extract</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-350M-Extract" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-350M-Extract-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td><a href="https://huggingface.co/onnx-community/LFM2-350M-Extract-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-350M-ENJP-MT</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-350M-ENJP-MT" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-350M-ENJP-MT-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/mlx-community/LFM2-350M-ENJP-MT-8bit" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/onnx-community/LFM2-350M-ENJP-MT-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-1.2B-RAG</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-1.2B-RAG" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-1.2B-RAG-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td><a href="https://huggingface.co/onnx-community/LFM2-1.2B-RAG-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-1.2B-Tool</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-1.2B-Tool" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-1.2B-Tool-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td><a href="https://huggingface.co/onnx-community/LFM2-1.2B-Tool-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-350M-Math</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-350M-Math" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-350M-Math-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td><a href="https://huggingface.co/onnx-community/LFM2-350M-Math-ONNX" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-350M-PII-Extract-JP</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-350M-PII-Extract-JP" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-350M-PII-Extract-JP-GGUF" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td style={{color: '#ef4444'}}>✗</td>
<td>Yes (TRL)</td>
</tr>
<tr>
<td style={{textAlign: 'left'}}>LFM2-ColBERT-350M</td>
<td><a href="https://huggingface.co/LiquidAI/LFM2-ColBERT-350M" style={{color: '#22c55e', textDecoration: 'none'}}>✓</a></td>
<td style={{color: '#ef4444'}}>✗</td>
<td style={{color: '#ef4444'}}>✗</td>
<td style={{color: '#ef4444'}}>✗</td>
<td>Yes (PyLate)</td>
</tr>
</tbody>
</table>

</details>

## 💬 LFM2 {#lfm2}

[LFM2](https://huggingface.co/LiquidAI/collections) is a family of general-purpose text-only language models optimized for edge AI and on-device deployment.

<a id="lfm2-5-text"></a>
### LFM2.5 Models <span style={{display: 'none'}}>Text</span> <span style={{display: 'inline-block', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: 'rgba(22, 163, 74, 1)', padding: '0.2em 0.6em', borderRadius: '0.375rem', fontSize: '0.75em', fontWeight: 500, marginLeft: '0.5em', verticalAlign: 'middle', letterSpacing: '0.01em'}}>Latest Release</span>

| Model | Description |
|-------|-------------|
| [`LiquidAI/LFM2.5-1.2B-Instruct`](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Instruct) | Updated version of LFM2-1.2B with improved training that delivers higher performance. Instruction-tuned model optimized for chat and following instructions. **Recommended for most use cases.** |
| [`LiquidAI/LFM2.5-1.2B-Base`](https://huggingface.co/LiquidAI/LFM2.5-1.2B-Base) | Base pre-trained model used to create all 1.2B variants. Ideal starting point for finetuning or building custom checkpoints. |
| [`LiquidAI/LFM2.5-1.2B-JP`](https://huggingface.co/LiquidAI/LFM2.5-1.2B-JP) | Japanese language model optimized for Japanese text generation and understanding. |

<a id="lfm2-text"></a>
### LFM2 Models <span style={{display: 'none'}}>Text</span>

| Model | Description |
|-------|-------------|
| [`LiquidAI/LFM2-8B-A1B`](https://huggingface.co/LiquidAI/LFM2-8B-A1B) | MoE model with 8B total parameters, 1.5B active per token for efficient inference. Best performance. |
| [`LiquidAI/LFM2-2.6B`](https://huggingface.co/LiquidAI/LFM2-2.6B) | High-performance model balancing capability and efficiency. |
| [`LiquidAI/LFM2-1.2B`](https://huggingface.co/LiquidAI/LFM2-1.2B) | Compact model for resource-constrained environments. |
| [`LiquidAI/LFM2-700M`](https://huggingface.co/LiquidAI/LFM2-700M) | Lightweight model for edge deployment. |
| [`LiquidAI/LFM2-350M`](https://huggingface.co/LiquidAI/LFM2-350M) | Tiny model for big data operations and edge deployment. Fastest inference. |

## 👁️ LFM2-VL {#lfm2-vl}

[LFM2-VL](https://huggingface.co/LiquidAI/collections) is a family of Vision Language Models (VLMs) that support text and image as inputs and text as outputs. These models are built on the LFM2 text model backbone with dynamic, user-tunable SigLIP2 NaFlex image encoders (Base 86M and shape-optimized 400M variants).

<a id="lfm2-5-vision"></a>
### LFM2.5 Models <span style={{display: 'none'}}>Vision</span> <span style={{display: 'inline-block', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: 'rgba(22, 163, 74, 1)', padding: '0.2em 0.6em', borderRadius: '0.375rem', fontSize: '0.75em', fontWeight: 500, marginLeft: '0.5em', verticalAlign: 'middle', letterSpacing: '0.01em'}}>Latest Release</span>

| Model | Description |
|-------|-------------|
| [`LiquidAI/LFM2.5-VL-1.6B`](https://huggingface.co/LiquidAI/LFM2.5-VL-1.6B) | Updated version of LFM2-VL-1.6B with improved training that delivers higher performance while maintaining the same architecture. **Recommended for most vision use cases.** |

<a id="lfm2-vision"></a>
### LFM2 Models <span style={{display: 'none'}}>Vision</span>

| Model | Description |
|-------|-------------|
| [`LiquidAI/LFM2-VL-3B`](https://huggingface.co/LiquidAI/LFM2-VL-3B) | Highest-capacity multimodal model with enhanced visual understanding and reasoning. |
| [`LiquidAI/LFM2-VL-1.6B`](https://huggingface.co/LiquidAI/LFM2-VL-1.6B) | Fast and capable model for scene understanding and other vision language tasks. |
| [`LiquidAI/LFM2-VL-450M`](https://huggingface.co/LiquidAI/LFM2-VL-450M) | Compact multimodal model for edge deployment and fast inference. |

## 🎵 LFM2-Audio {#lfm2-audio}

[LFM2-Audio](https://huggingface.co/LiquidAI/collections) is a family of audio foundation models that support text and audio both as inputs and outputs.

<a id="lfm2-5-audio"></a>
### LFM2.5 Models <span style={{display: 'none'}}>Audio</span> <span style={{display: 'inline-block', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: 'rgba(22, 163, 74, 1)', padding: '0.2em 0.6em', borderRadius: '0.375rem', fontSize: '0.75em', fontWeight: 500, marginLeft: '0.5em', verticalAlign: 'middle', letterSpacing: '0.01em'}}>Latest Release</span>

| Model | Description |
|-------|-------------|
| [`LiquidAI/LFM2.5-Audio-1.5B`](https://huggingface.co/LiquidAI/LFM2.5-Audio-1.5B) | Updated version of LFM2-Audio with a custom LFM-based audio detokenizer for better ASR and TTS performance. **Recommended for most audio use cases.** |

<a id="lfm2-audio-models"></a>
### LFM2 Models <span style={{display: 'none'}}>Audio</span>

| Model | Description |
|-------|-------------|
| [`LiquidAI/LFM2-Audio-1.5B`](https://huggingface.co/LiquidAI/LFM2-Audio-1.5B) | Audio-to-audio processing model for speech tasks, like chat, ASR, and TTS. |

## 🎯 Liquid Nanos {#liquid-nanos}

[Liquid Nanos](https://huggingface.co/collections/LiquidAI/liquid-nanos-68b98d898414dd94d4d5f99a) are task-specific models fine-tuned for specialized use cases.

| Model | Description |
|-------|-------------|
| [`LiquidAI/LFM2-1.2B-Extract`](https://huggingface.co/LiquidAI/LFM2-1.2B-Extract) | Extract important information from a wide variety of unstructured documents into structured outputs like JSON. [See prompting guidelines](/lfm/key-concepts/text-generation-and-prompting#lfm2-extract) |
| [`LiquidAI/LFM2-350M-Extract`](https://huggingface.co/LiquidAI/LFM2-350M-Extract) | Smaller version of the extraction model. [See prompting guidelines](/lfm/key-concepts/text-generation-and-prompting#lfm2-extract) |
| [`LiquidAI/LFM2-350M-ENJP-MT`](https://huggingface.co/LiquidAI/LFM2-350M-ENJP-MT) | Near real-time bi-directional Japanese/English translation of short-to-medium inputs. > [See prompting guidelines](/lfm/key-concepts/text-generation-and-prompting#lfm2-350m-enjp-mt) |
| [`LiquidAI/LFM2-1.2B-RAG`](https://huggingface.co/LiquidAI/LFM2-1.2B-RAG) | Answer questions based on provided contextual documents, for use in RAG systems. > [See prompting guidelines](/lfm/key-concepts/text-generation-and-prompting#lfm2-rag) |
| [`LiquidAI/LFM2-1.2B-Tool`](https://huggingface.co/LiquidAI/LFM2-1.2B-Tool) | Efficient model optimized for concise and precise tool calling. [See tool use guidelines](tool-use.md) |
| [`LiquidAI/LFM2-350M-Math`](https://huggingface.co/LiquidAI/LFM2-350M-Math) | Tiny reasoning model designed for tackling tricky math problems. |
| [`LiquidAI/LFM2-350M-PII-Extract-JP`](https://huggingface.co/LiquidAI/LFM2-350M-PII-Extract-JP) | Extract personally identifiable information (PII) from Japanese text and output it in JSON format. |
| [`LiquidAI/LFM2-ColBERT-350M`](https://huggingface.co/LiquidAI/LFM2-ColBERT-350M) | Embed documents and queries for fast retrieval and reranking across many languages. |

## GGUF Models

GGUF quantized versions are available for all LFM2 models for efficient inference with [llama.cpp](../inference/llama-cpp.md), [LM Studio](../inference/lm-studio.md), and [Ollama](../inference/ollama.md). These models offer reduced memory usage and faster CPU inference.

To access our official GGUF models, append `-GGUF` to any model repository name (e.g., `LiquidAI/LFM2-1.2B-GGUF`). All models are available in multiple quantization levels (`Q4_0`, `Q4_K_M`, `Q5_K_M`, `Q6_K`, `Q8_0`, `F16`).

## MLX Models

MLX quantized versions are available for many of the LFM2 model library for efficient inference on Apple Silicon with [MLX](../inference/mlx.md). These models leverage unified memory architecture for optimal performance on M-series chips.

Browse all MLX-compatible models at [mlx-community LFM2 models](https://huggingface.co/mlx-community/collections?search=LFM). All models are available in multiple quantization levels (`4-bit`, `5-bit`, `6-bit`, `8-bit`, `bf16`).
