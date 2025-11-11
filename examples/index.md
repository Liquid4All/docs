# Examples

<style>{`
/* Examples Grid */
.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.example-card {
  border: 1px solid var(--ifm-color-emphasis-300);
  border-radius: 8px;
  padding: 1.5rem;
  background: var(--ifm-background-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.example-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--ifm-color-primary);
  text-decoration: none;
  color: inherit;
}

.example-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.example-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--ifm-color-primary), var(--ifm-color-primary-dark));
  color: white;
}

.example-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--ifm-heading-color);
  margin: 0;
}

.example-description {
  color: var(--ifm-color-content-secondary);
  line-height: 1.5;
  flex-grow: 1;
  margin-bottom: 1rem;
}

.example-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: auto;
}

.example-tag {
  background: var(--ifm-color-emphasis-200);
  color: var(--ifm-color-emphasis-700);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 500;
}

@media (max-width: 768px) {
  .examples-grid {
    grid-template-columns: 1fr;
  }
}
`}</style>
<div className="examples-grid" id="examplesGrid">

<a href="/examples/laptop-examples/invoice-extractor-tool-with-liquid-nanos" className="example-card" data-platform="laptops" data-type="end-to-end" data-search="invoice extractor tool structured data document processing pipeline liquid nano">
  <div className="example-header">
    <span className="example-icon">📄</span>
    <div className="example-title">Invoice Extractor Tool</div>
  </div>
  <div className="example-description">
    Extract structured data from invoices using Liquid Nano models. Learn how to build a complete document processing pipeline.
  </div>
  <div className="example-tags">
    <span className="example-tag">Laptop</span>
    <span className="example-tag">End-to-End</span>
  </div>
</a>

<a href="/examples/deploy-models-on-ios/slogan-generator-app" className="example-card" data-platform="ios" data-type="deployment" data-search="slogan generator ios app swift leap sdk on-device ai">
  <div className="example-header">
    <span className="example-icon">✨</span>
    <div className="example-title">Slogan Generator App</div>
  </div>
  <div className="example-description">
    Build an iOS app that generates creative slogans using on-device AI. Learn Swift integration with the LEAP SDK.
  </div>
  <div className="example-tags">
    <span className="example-tag">iOS</span>
    <span className="example-tag">Deployment</span>
  </div>
</a>

<a href="/examples/customize-models/car-maker-identification" className="example-card" data-platform="laptops" data-type="customization" data-search="car maker identification images classification fine-tuning customization computer vision lora">
  <div className="example-header">
    <span className="example-icon">🚗</span>
    <div className="example-title">Car Maker Identification</div>
  </div>
  <div className="example-description">
    Fine-tune LFM2-VL to identify car makers from images. Learn structured generation with Outlines and parameter-efficient fine-tuning with LoRA.
  </div>
  <div className="example-tags">
    <span className="example-tag">Laptop</span>
    <span className="example-tag">Customization</span>
  </div>
</a>

</div>

:::note[See also]
**📚 [Liquid AI Cookbook](https://github.com/Liquid4All/cookbook)** - Explore examples, tutorials, and end-to-end applications built with LFM2 models and the LEAP SDK. Find fine-tuning notebooks, edge deployment examples, and community-built apps to get started quickly.
:::

## Cannot find the example you need?

Join the Discord community and let us know

[![Discord](https://img.shields.io/discord/1385439864920739850?color=7289da&label=Join%20Discord&logo=discord&logoColor=white)](https://discord.gg/DFU3WQeaYD)
