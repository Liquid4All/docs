import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const components = new Map();
const CodeBlock = Symbol('CodeBlock');
const React = {
  Fragment: Symbol('Fragment'),
  createElement: (type, props, ...children) => ({ type, props: props ?? {}, children }),
};

// Evaluate only the repository's trusted JSX templates, without Node globals.
function evaluate(source) {
  const compiled = ts.transpileModule(source, {
    fileName: 'template.tsx',
    compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const context = { React, CodeBlock, exports: {} };
  vm.runInNewContext(compiled, context, { timeout: 1000 });
  return context.exports;
}

export function markdown(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (Array.isArray(node)) return node.map(markdown).join('');
  if (typeof node !== 'object') return String(node);
  const text = node.children.map(markdown).join('');
  if (node.type === CodeBlock) return `\n\n\`\`\`${node.props.language ?? ''}\n${text}\n\`\`\`\n\n`;
  if (node.type === React.Fragment) return text;
  switch (node.type) {
    case 'div': return text;
    case 'p': return `\n\n${text}\n\n`;
    case 'strong': return `**${text}**`;
    case 'code': return `\`${text}\``;
    case 'a': return `[${text}](${node.props.href})`;
    case 'ul': return `\n\n${text}\n`;
    case 'li': return `- ${text}\n`;
    default: throw new Error(`Unsupported template element: ${String(node.type)}`);
  }
}

export function renderQuickstart(metadata) {
  if (!/^\/snippets\/quickstart\/[a-z-]+\.mdx$/.test(metadata.source)) {
    throw new Error(`Invalid quickstart source: ${metadata.source}`);
  }
  if (!components.has(metadata.source)) {
    components.set(metadata.source, evaluate(fs.readFileSync(path.join(root, metadata.source), 'utf8')));
  }
  const component = components.get(metadata.source)[metadata.component];
  if (typeof component !== 'function') throw new Error(`Missing component: ${metadata.component}`);
  return markdown(component(metadata.props)).trim().split(/(```[\s\S]*?```)/g)
    .map((part, index) => index % 2 ? part : part.replace(/\n{3,}/g, '\n\n')).join('');
}

const marker = /\{\/\* quickstart: (.+?) \*\/\}\n[\s\S]*?\n\{\/\* \/quickstart \*\/\}/g;
const block = (metadata) => `{/* quickstart: ${JSON.stringify(metadata)} */}\n${renderQuickstart(metadata)}\n{/* /quickstart */}`;

export function materialize(source) {
  let result = source.replace(marker, (_, json) => block(JSON.parse(json)));
  const imports = [...result.matchAll(/^import \{ (\w+) \} from "(\/snippets\/quickstart\/[a-z-]+\.mdx)";?\n/gm)];
  for (const [importLine, name, modulePath] of imports) {
    const calls = new RegExp(`<${name}\\b[\\s\\S]*?(?:\\/>|><\\/${name}>)`, 'g');
    result = result.replace(calls, (call) => {
      const jsx = call.replace(new RegExp(`^<${name}`), '<Capture').replace(new RegExp(`</${name}>$`), '</Capture>');
      const compiled = ts.transpileModule(`exports.props = (${jsx});`, {
        fileName: 'props.tsx', compilerOptions: { jsx: ts.JsxEmit.React },
      }).outputText;
      const context = { exports: {}, Capture: 'Capture', React };
      vm.runInNewContext(compiled, context, { timeout: 1000 });
      return block({ source: modulePath, component: name, props: context.exports.props.props });
    });
    if (!new RegExp(`<${name}\\b`).test(result)) result = result.replace(importLine, '');
  }
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check');
  const changed = [];
  for (const name of fs.readdirSync(path.join(root, 'lfm/models')).filter((name) => name.endsWith('.mdx'))) {
    const file = path.join(root, 'lfm/models', name);
    const original = fs.readFileSync(file, 'utf8');
    const updated = materialize(original);
    if (original !== updated) {
      changed.push(name);
      if (!check) fs.writeFileSync(file, updated);
    }
  }
  if (check && changed.length) throw new Error(`Regenerate quickstarts with node scripts/materializeQuickstarts.mjs: ${changed.join(', ')}`);
  console.log(check ? 'Model quickstarts are current.' : `Updated ${changed.length} model pages with literal Markdown code fences.`);
}
