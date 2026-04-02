#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STARTER_ROOT = path.join(ROOT, 'starter-kit');
const VERSION_PATH = path.join(ROOT, 'version.json');
const STARTER_VERSION_PATH = path.join(STARTER_ROOT, 'version.json');
const CSS_PATH = path.join(ROOT, 'src', 'nexled.css');
const HTML_FILES = ['Atoms.html', 'molecules.html', 'organisms.html'].map(file => path.join(ROOT, file));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeText(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, 'utf8');
}

function writeJson(filePath, value) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function decodeEntities(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function collectStateTokens(line, bucket) {
  const explicitStates = line.match(/\.(?:is|has)-[\w-]+/g) || [];
  explicitStates.forEach(state => bucket.add(state));
  ['aria-expanded', 'aria-selected', 'aria-pressed', 'aria-disabled', 'aria-current'].forEach(token => {
    if (line.includes(token)) {
      bucket.add(`[${token}]`);
    }
  });
  [':hover', ':active', ':focus-visible', ':disabled', ':focus-within', ':visited'].forEach(token => {
    if (line.includes(token)) {
      bucket.add(token);
    }
  });
}

function extractSections(cssContent) {
  const sections = [];
  let current = {
    name: 'Uncategorized',
    slug: 'uncategorized',
    classes: new Set(),
    states: new Set(),
  };
  sections.push(current);

  for (const line of cssContent.split(/\r?\n/)) {
    const headingMatch = line.match(/^\/\*\s*([A-Z][A-Z\s/&-]+)\s*\*\/$/);
    if (headingMatch) {
      current = {
        name: headingMatch[1].trim(),
        slug: slugify(headingMatch[1]),
        classes: new Set(),
        states: new Set(),
      };
      sections.push(current);
      continue;
    }

    const selectorMatches = Array.from(line.matchAll(/\.([A-Za-z][\w-]*)/g));
    selectorMatches.forEach(match => current.classes.add(match[1]));
    collectStateTokens(line, current.states);
  }

  return sections;
}

function extractSnippets(filePath) {
  const htmlContent = fs.readFileSync(filePath, 'utf8');
  const snippets = [];
  const regex = /<pre[^>]*>\s*<code[^>]*id="(snippet-[^"]+)"[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi;
  let match;

  while ((match = regex.exec(htmlContent)) !== null) {
    snippets.push({
      id: match[1],
      source: path.basename(filePath),
      code: decodeEntities(match[2]).trim(),
    });
  }

  return snippets;
}

function extractHtmlClassTokens(filePath) {
  const htmlContent = fs.readFileSync(filePath, 'utf8');
  const tokens = new Set();
  const regex = /class\s*=\s*(["'])([\s\S]*?)\1/gi;
  let match;

  while ((match = regex.exec(htmlContent)) !== null) {
    match[2].split(/\s+/).filter(Boolean).forEach(token => tokens.add(token));
  }

  return Array.from(tokens);
}

function snippetMatchesSection(snippet, section) {
  const nameTokens = section.slug.split('-').filter(Boolean);
  if (nameTokens.some(token => snippet.id.toLowerCase().includes(token))) {
    return true;
  }

  return Array.from(section.classes).some(className => new RegExp(`(^|[^a-z0-9-])${className}([^a-z0-9-]|$)`, 'i').test(snippet.code));
}

function derivePrefixes(classes) {
  const prefixes = new Set();
  classes.forEach(className => {
    const parts = className.split('-');
    if (parts[0]) {
      prefixes.add(parts[0]);
    }
    if (parts.length > 1) {
      prefixes.add(parts.slice(0, 2).join('-'));
    }
  });
  return Array.from(prefixes).sort();
}

function looksLikePublishedHelper(token, prefixes) {
  return prefixes.some(prefix => token === prefix || token.startsWith(`${prefix}-`));
}

function buildRegistry(versionMeta, sections, snippets, htmlClassTokens) {
  const sectionRecords = sections
    .map(section => {
      const classes = Array.from(section.classes).sort();
      const states = Array.from(section.states).sort();
      const examples = snippets.filter(snippet => snippetMatchesSection(snippet, section)).slice(0, 8);
      return {
        name: section.name,
        slug: section.slug,
        classes,
        states,
        examples,
      };
    })
    .filter(section => section.classes.length > 0);

  const cssClasses = sectionRecords.flatMap(section => section.classes);
  const cssClassSet = new Set(cssClasses);
  const cssPrefixes = derivePrefixes(cssClasses);
  const helperClasses = Array.from(new Set(
    htmlClassTokens.filter(token => !cssClassSet.has(token) && looksLikePublishedHelper(token, cssPrefixes))
  )).sort();

  if (helperClasses.length > 0) {
    sectionRecords.push({
      name: 'HTML HELPERS',
      slug: 'html-helpers',
      classes: helperClasses,
      states: [],
      examples: [],
    });
  }

  const allClasses = sectionRecords.flatMap(section => section.classes);
  const allStates = Array.from(new Set(sectionRecords.flatMap(section => section.states))).sort();

  return {
    name: versionMeta.name,
    version: versionMeta.version,
    released: versionMeta.released,
    generatedAt: new Date().toISOString(),
    complianceMode: versionMeta.complianceMode,
    source: {
      css: path.relative(ROOT, CSS_PATH).replace(/\\/g, '/'),
      html: HTML_FILES.map(filePath => path.relative(ROOT, filePath).replace(/\\/g, '/')),
    },
    sections: sectionRecords,
    classes: Array.from(new Set(allClasses)).sort(),
    states: allStates,
    familyPrefixes: derivePrefixes(allClasses),
    snippets,
  };
}

function buildMarkdown(registry) {
  const lines = [];
  lines.push('# NexLed Components Reference');
  lines.push('');
  lines.push('> Auto-generated by `scripts/build-components-md.js`.');
  lines.push(`> Version: ${registry.version}`);
  lines.push(`> Generated: ${registry.generatedAt.split('T')[0]}`);
  lines.push('> Machine-readable registry: `component-registry.json`');
  lines.push('');
  lines.push('## Overview');
  lines.push('');
  lines.push(`- Published component sections: ${registry.sections.length}`);
  lines.push(`- Published classes: ${registry.classes.length}`);
  lines.push(`- Recognized state hooks: ${registry.states.length}`);
  lines.push('');
  lines.push('## Published Sections');
  lines.push('');
  registry.sections.forEach(section => {
    lines.push(`- **${section.name}** (${section.classes.length} classes)`);
  });
  lines.push('');

  registry.sections.forEach(section => {
    lines.push(`## ${section.name}`);
    lines.push('');
    lines.push('### Classes');
    lines.push('');
    section.classes.forEach(className => lines.push(`- \`.${className}\``));
    lines.push('');

    if (section.states.length > 0) {
      lines.push('### States');
      lines.push('');
      section.states.forEach(state => lines.push(`- \`${state}\``));
      lines.push('');
    }

    if (section.examples.length > 0) {
      lines.push('### Examples');
      lines.push('');
      section.examples.forEach(example => {
        lines.push(`#### ${example.id} (${example.source})`);
        lines.push('');
        lines.push('```html');
        lines.push(example.code);
        lines.push('```');
        lines.push('');
      });
    }
  });

  return `${lines.join('\n')}\n`;
}

function outputTargets(meta, baseDir) {
  return {
    components: path.join(baseDir, meta.files.components),
    registry: path.join(baseDir, meta.files.registry),
  };
}

function main() {
  const versionMeta = readJson(VERSION_PATH);
  const starterVersionMeta = readJson(STARTER_VERSION_PATH);
  const cssContent = fs.readFileSync(CSS_PATH, 'utf8');
  const sections = extractSections(cssContent);
  const snippets = HTML_FILES.flatMap(extractSnippets);
  const htmlClassTokens = Array.from(new Set(HTML_FILES.flatMap(extractHtmlClassTokens)));
  const registry = buildRegistry(versionMeta, sections, snippets, htmlClassTokens);
  const markdown = buildMarkdown(registry);

  const rootTargets = outputTargets(versionMeta, ROOT);
  const starterTargets = outputTargets(starterVersionMeta, STARTER_ROOT);

  writeText(rootTargets.components, markdown);
  writeJson(rootTargets.registry, registry);
  writeText(starterTargets.components, markdown);
  writeJson(starterTargets.registry, registry);

  console.log(`Generated ${path.relative(ROOT, rootTargets.components)} and ${path.relative(ROOT, rootTargets.registry)}`);
  console.log(`Mirrored ${path.relative(ROOT, starterTargets.components)} and ${path.relative(ROOT, starterTargets.registry)}`);
}

main();