# LEAP

[LEAP](https://leap.liquid.ai) (Liquid Edge AI Platform) is an integrated toolchain that simplifies the entire edge AI development process: from model discovery, through customization, to deployment. Deploy AI models on-device as easily as calling a cloud API.

## Key Features

- [**Model Search**](https://leap.liquid.ai/search) helps you find the ideal model for your use case. Set your device constraints, describe your task, and test competitive models to find the best option for your hardware.

- [**Model Library**](https://leap.liquid.ai/models) provides model bundles ready for download and deployment with the Edge SDK. Browse optimized bundles for LFM2 and Qwen3 models.

- [**Model Bundling Service**](https://leap.liquid.ai/docs/leap-bundle/quick-start) is a CLI tool for creating deployment-ready model bundles from any base or fine-tuned model.

## Basic Usage

**Install:**

```bash
pip install leap-bundle
```

**Authenticate:**

```bash
leap-bundle login <api-key>
```

**Create model bundle:**

```bash
leap-bundle create <path-to-your-model-checkpoint>
```

The bundling service handles model quantization, format conversion, and packaging. Once created, check bundle status with `leap-bundle list`.

## Edge SDK

The [**LEAP Edge SDK**](https://leap.liquid.ai/docs/edge-sdk/overview) enables on-device model inference in mobile apps with minimal code. Deploy model bundles directly into iOS and Android apps in less than 15 lines of code with support for streaming generation, constrained generation, and function calling.

**Get started:** [iOS Quick Start](https://leap.liquid.ai/docs/edge-sdk/ios/ios-quick-start-guide) | [Android Quick Start](https://leap.liquid.ai/docs/edge-sdk/android/android-quick-start-guide)

## Laptop Support

[**LEAP Laptop Support**](https://leap.liquid.ai/docs/laptop-support) provides optimized pre-compiled llama.cpp binaries for running LFM models on laptops. Pre-compiled binaries eliminate manual compilation and ensure optimal performance for AMD Ryzen™ chips, different OS configurations, and CPU/GPU acceleration.

## Additional Resources

- **[Complete Documentation](https://leap.liquid.ai/docs)** - Full API reference and guides
- **[Apollo App](https://www.liquid.ai/apollo)** - Test LEAP models on your iOS or Android device
- **[Liquid AI Cookbook](https://github.com/Liquid4All/cookbook)** - End‑to‑end finetuning notebooks and project examples
- **[Join the Community](https://discord.gg/liquid-ai)** - Get support and stay updated on Discord

LEAP is designed for any app developer—regardless of their familiarity with AI—to build powerful edge AI applications with LFM models.
