# Inference Overview

LFM2 models are designed for efficient inference across a wide range of platforms and frameworks. Choose the right inference solution based on your specific needs and environment.

## Quick Start

For a quick start with LFM2 models, try [Transformers](transformers.md) which provides the simplest setup with minimal dependencies.

## Inference Options

### **Production & High Throughput**
- **[vLLM](vllm.md)** - High-throughput inference engine with GPU acceleration, continuous batching, and optimized CUDA kernels. Best for production deployments serving many concurrent requests.

### **CPU & Edge Deployment**  
- **[llama.cpp](llama-cpp.md)** - C++ library for CPU-first inference with minimal dependencies. Ideal for edge deployment, CPU-only environments, and local development.
- **[MLX](mlx.md)** - Apple's framework optimized for Apple Silicon Macs with Metal GPU acceleration and unified memory architecture.

### **User-Friendly Tools**
- **[Transformers](transformers.md)** - Python library for simple inference and experimentation. Best for research, prototyping, and integration with the Hugging Face ecosystem.
- **[LM Studio](lm-studio.md)** - Desktop application with graphical interface for running models locally. No command-line setup required.
- **[Ollama](ollama.md)** - Command-line tool with simple model management and OpenAI-compatible API. Easy local serving and Docker deployment.

## Choosing the Right Option

| Framework | Best For | GPU Support | Setup Complexity |
|-----------|----------|-------------|------------------|
| **[vLLM](vllm.md)** | Production, high throughput | CUDA required | Medium |
| **[Transformers](transformers.md)** | Research, experimentation | Optional | Low |
| **[llama.cpp](llama-cpp.md)** | CPU-only, edge deployment | Optional | Medium |
| **[MLX](mlx.md)** | Apple Silicon Macs | Metal (Apple) | Low |
| **[LM Studio](lm-studio.md)** | No-code GUI experience | Auto-detected | Very Low |
| **[Ollama](ollama.md)** | Simple local serving | Auto-detected | Low |

## Model Formats

Different inference frameworks support different model formats:

- **Transformers**: Uses original Hugging Face format
- **vLLM**: Uses Hugging Face format with optimizations
- **llama.cpp, LM Studio, Ollama**: Use [GGUF format](../key-concepts/models.md#gguf-models) for quantized models
- **MLX**: Uses [MLX format](../key-concepts/models.md#mlx-models) optimized for Apple Silicon

## Performance Considerations

- **For maximum throughput**: Use [vLLM](vllm.md) with GPU acceleration
- **For minimal memory usage**: Use [llama.cpp](llama-cpp.md) with quantized GGUF models
- **For Apple Silicon**: Use [MLX](mlx.md) for optimal performance on M-series chips
- **For development**: Use [Transformers](transformers.md) for flexibility and ecosystem integration

## Next Steps

1. **Start with [Transformers](transformers.md)** for initial experimentation
2. **Scale with [vLLM](vllm.md)** for production deployments
3. **Deploy with [llama.cpp](llama-cpp.md)** for edge and CPU-only environments
4. **Try [LM Studio](lm-studio.md)** for a graphical interface experience

All LFM2 models support a **32k token context length** and are compatible with these inference frameworks out of the box.
