---
sidebar_label: "Introduction"
---

# Welcome to the LFM docs

Liquid Foundational Models (LFMs) are a family of [open-source](https://huggingface.co/LiquidAI/collections) models built by Liquid AI from the ground up with
- **state-of-the-art quality**, outpeforming similar-sizeed models on benchmarks.
- **lowest memory consumption** thanks to its [optimal hybrid architecture](https://www.arxiv.org/pdf/2511.23404).
- **the fastest inference in the world**, and most probably in the entire Universe.

We give you the models. You run them <span style={{color: 'var(--ifm-color-primary)'}}>**wherever**</span> you want.

<div className="deployment-grid">

<a href="/lfm/getting-started/quickstart" className="deployment-card-link">
<div className="deployment-card">
<div className="deployment-icon">🚀</div>
<h4>Deploy your first LFM in minutes</h4>
<p>Get started quickly with step-by-step deployment guides</p>
</div>
</a>

<a href="/lfm/key-concepts/models" className="deployment-card-link">
<div className="deployment-card">
<div className="deployment-icon">🔍</div>
<h4>Explore models</h4>
<p>Browse our collection of language models and their capabilities</p>
</div>
</a>

<a href="/lfm/inference/transformers" className="deployment-card-link">
<div className="deployment-card">
<div className="deployment-icon">📖</div>
<h4>Inference guides</h4>
<p>Learn how to run models for different use cases and platforms</p>
</div>
</a>

<a href="/lfm/fine-tuning/trl" className="deployment-card-link">
<div className="deployment-card">
<div className="deployment-icon">🛠️</div>
<h4>Fine tuning guides</h4>
<p>Customize models for your specific requirements and datasets</p>
</div>
</a>

</div>

<style>{`

.deployment-grid {
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.deployment-card {
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--ifm-background-surface-color);
  transition: all 0.2s ease;
  text-align: center;
}

.deployment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: var(--ifm-color-primary);
}

.deployment-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.deployment-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--ifm-color-emphasis-900);
}

.deployment-card p {
  margin: 0 0 1rem 0;
  color: var(--ifm-color-emphasis-700);
  font-size: 0.9rem;
  line-height: 1.4;
}
`}</style>
