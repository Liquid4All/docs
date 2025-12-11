---
sidebar_label: "Introduction"
---

# Getting started with Liquid Foundational Model (LFMs)

Liquid Foundational Models (LFMs) are a family of [open-source](https://huggingface.co/LiquidAI/collections) models built by Liquid AI from the ground up with
- **state-of-the-art quality**, outpeforming similar-sizeed models on benchmarks.
- **lowest memory consumption** thanks to its [optimal hybrid architecture](https://www.arxiv.org/pdf/2511.23404).
- **the fastest inference in the world**, and most probably in the entire Universe.

We give you the models. You run them <span style={{color: 'var(--ifm-color-primary)'}}>**wherever**</span> you want.

## Deploy your first LFM model

<div className="deployment-grid">

<div className="deployment-card">
<div className="deployment-icon">💻</div>
<h4>Laptops</h4>
<p>Run models locally on your laptop or desktop</p>
</div>

<div className="deployment-card">
<div className="deployment-icon">📱</div>
<h4>Mobile</h4>
<p>On-device inference for iOS and Android applications</p>
</div>

<div className="deployment-card">
<div className="deployment-icon">☁️</div>
<h4>Cloud</h4>
<p>Deploy on AWS, Google Cloud, Azure, and other cloud platforms</p>
</div>

<div className="deployment-card">
<div className="deployment-icon">🌐</div>
<h4>Browser</h4>
<p>Client-side inference directly in web browsers using Transformers.js</p>
</div>
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
