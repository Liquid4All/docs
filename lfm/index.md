# Welcome to LFM Docs! 👋

**LFM2** is a new generation of hybrid models developed by [Liquid AI](https://www.liquid.ai/), specifically designed for **edge AI and on-device deployment**.

## Why LFM2?

Built on a new hybrid architecture, LFM2 sets a new standard in terms of quality, speed, and memory efficiency.

&nbsp;&nbsp;⚡ **3x faster training** - New hybrid architecture accelerates training and inference

&nbsp;&nbsp;🏆 **State-of-the-art quality** - Outperforms similar-sized models on benchmarks

&nbsp;&nbsp;💾 **Memory efficient** - Optimized for resource-constrained environments

&nbsp;&nbsp;🌐 **Deploy anywhere** - Compatible with major inference frameworks and platforms

[Learn more about the architecture →](https://www.liquid.ai/blog/liquid-foundation-models-v2-our-second-series-of-generative-ai-models)

## Model Families

<style>{`
.model-grid-1122 {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .model-grid-1122 {
    grid-template-columns: repeat(2, 1fr);
  }
}

.model-card {
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  padding: 1rem;
  background-color: var(--ifm-background-surface-color);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
}

.model-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--ifm-color-primary);
  text-decoration: none;
  color: inherit;
}

.model-card h3 {
  margin: 0 0 0.5rem 0;
  transition: color 0.2s ease-in-out;
}

.model-card:hover h3 {
  color: var(--ifm-color-primary);
}

.model-card p {
  margin: 0 0 1rem 0;
  color: var(--ifm-color-emphasis-700);
}

.model-card .learn-more {
  color: var(--ifm-color-primary);
  text-decoration: none;
  font-weight: 500;
}

.model-card:hover .learn-more {
  text-decoration: underline;
}
`}</style>

<div className="model-grid-1122">

<a href="getting-started/models#lfm2" className="model-card">
<h3>💬 Text Models</h3>
<p>General-purpose language models from 350M to 8B parameters</p>
<span className="learn-more">Learn more →</span>
</a>

<a href="getting-started/models#lfm2-vl" className="model-card">
<h3>👁️ Vision-Language</h3>
<p>Multimodal models for image understanding and scene analysis</p>
<span className="learn-more">Learn more →</span>
</a>

<a href="getting-started/models#lfm2-audio" className="model-card">
<h3>🎵 Audio</h3>
<p>Speech and audio processing models for ASR, TTS, and chat</p>
<span className="learn-more">Learn more →</span>
</a>

<a href="getting-started/models#liquid-nanos" className="model-card">
<h3>🎯 Task-Specific</h3>
<p>Specialized models for extraction, translation, RAG, and tool use</p>
<span className="learn-more">Learn more →</span>
</a>

</div>

[Explore all models →](key-concepts/models.md)

## Get Started

<style>{`
.get-started-grid-1124 {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .get-started-grid-1124 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .get-started-grid-1124 {
    grid-template-columns: repeat(4, 1fr);
  }
}
`}</style>

<div className="get-started-grid-1124">

<a href="getting-started/quickstart" className="model-card">
<h3>🏃 Quickstart</h3>
<p>Install and run your first LFM2 model in minutes</p>
<span className="learn-more">Get started →</span>
</a>

<a href="inference/transformers" className="model-card">
<h3>🚀 Inference</h3>
<p>Deploy models with popular inference tools</p>
<span className="learn-more">Learn more →</span>
</a>

<a href="fine-tuning/trl" className="model-card">
<h3>🔧 Fine-tuning</h3>
<p>Train models with TRL, Unsloth, and Axolotl</p>
<span className="learn-more">Learn more →</span>
</a>

<a href="https://github.com/Liquid4All/cookbook" className="model-card">
<h3>📚 Cookbook</h3>
<p>Examples, tutorials, and community apps</p>
<span className="learn-more">Explore →</span>
</a>

</div>
