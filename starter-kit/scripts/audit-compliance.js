#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const VERSION_PATH = path.join(ROOT, 'version.json');

const VIOLATIONS = {
  STYLE_BLOCK: 'STYLE_BLOCK',
  INLINE_STYLE: 'INLINE_STYLE',
  INLINE_EVENT_HANDLER: 'INLINE_EVENT_HANDLER',
  ARBITRARY_TAILWIND: 'ARBITRARY_TAILWIND',
  HARDCODED_HEX: 'HARDCODED_HEX',
  MISSING_HEAD_ASSET: 'MISSING_HEAD_ASSET',
  WRONG_HEAD_ORDER: 'WRONG_HEAD_ORDER',
  WRONG_CDN_VERSION: 'WRONG_CDN_VERSION',
  MISSING_NEXLED_JS: 'MISSING_NEXLED_JS',
  BROKEN_LOCAL_REFERENCE: 'BROKEN_LOCAL_REFERENCE',
  UNKNOWN_NEXLED_CLASS: 'UNKNOWN_NEXLED_CLASS',
  LOCAL_COMPONENT_OVERRIDE: 'LOCAL_COMPONENT_OVERRIDE',
  LOCAL_CSS_FILE: 'LOCAL_CSS_FILE',
};

const INTERACTIVE_HINTS = [
  /\bnav-bar\b/,
  /\bdropdown\b/,
  /\baccordion\b/,
  /\bdrawer-sheet\b/,
  /\bmodal-overlay\b/,
  /\bsearch-overlay\b/,
  /\btoast\b/,
  /\bcarousel\b/,
  /\bsegmented-control\b/,
  /\btab-bar\b/,
  /\blanguage-selector\b/,
  /\bdata-table\b/,
  /\bsidebar\b/,
  /\bannouncement-bar\b/,
  /data-flyout-root/,
  /data-dismiss-surface/,
  /data-drawer-open/,
];

const NEXLED_FAMILY_PREFIXES = [
  'accordion', 'alert', 'announcement', 'avatar', 'badge', 'breadcrumb', 'btn', 'card', 'carousel',
  'checkbox', 'combobox', 'data-table', 'date-picker', 'drawer-sheet', 'dropdown', 'empty-state',
  'footer', 'language-selector', 'link', 'list', 'material-selector', 'modal', 'nav-bar', 'page-header',
  'pagination', 'panel', 'quantity-selector', 'radio', 'range-slider', 'search-overlay', 'segmented-control',
  'sidebar', 'skeleton', 'spinner', 'stepper', 'tab-bar', 'text-field', 'toast', 'toggle', 'tooltip', 'uploader'
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function versionPin(version) {
  return version.split('.').slice(0, 2).join('.');
}

const VERSION_META = readJson(VERSION_PATH);
const REGISTRY = readJson(path.join(ROOT, VERSION_META.files.registry));
const EXPECTED_PIN = versionPin(VERSION_META.version);
const CDN_BASE = VERSION_META.cdn.replace(/\/$/, '');
const EXPECTED = {
  config: `${CDN_BASE}/${VERSION_META.files.config}?v=${EXPECTED_PIN}`,
  css: `${CDN_BASE}/${VERSION_META.files.css}?v=${EXPECTED_PIN}`,
  js: `${CDN_BASE}/${VERSION_META.files.js}?v=${EXPECTED_PIN}`,
  fontsPreconnect: 'https://fonts.googleapis.com',
  fontsStatic: 'https://fonts.gstatic.com',
  fontStylesheet: 'Urbanist:wght@300;400;500;600;700',
  remix: 'remixicon@4.5.0/fonts/remixicon.css',
  tailwind: 'https://cdn.tailwindcss.com',
};
const REGISTRY_CLASS_SET = new Set(REGISTRY.classes || []);

function pushViolation(target, type, line, severity, level, message, content = '') {
  target.push({ type, line, severity, level, message, content });
}

function isExternalRef(value) {
  return /^(?:[a-z]+:|#|\/\/)/i.test(value);
}

function normalizeRef(value) {
  return value.split('#')[0].split('?')[0];
}

function hasExactPathCase(targetPath) {
  const resolvedPath = path.resolve(targetPath);
  if (!fs.existsSync(resolvedPath)) {
    return false;
  }

  const parsed = path.parse(resolvedPath);
  let current = parsed.root;
  const segments = resolvedPath.slice(parsed.root.length).split(path.sep).filter(Boolean);

  for (const segment of segments) {
    const entries = fs.readdirSync(current);
    if (!entries.includes(segment)) {
      return false;
    }
    current = path.join(current, segment);
  }

  return true;
}

function stripHtmlCommentsFromLine(line, inComment) {
  let visible = '';
  let cursor = 0;
  let commentState = inComment;

  while (cursor < line.length) {
    if (commentState) {
      const commentEnd = line.indexOf('-->', cursor);
      if (commentEnd === -1) {
        return { visible, inComment: true };
      }
      cursor = commentEnd + 3;
      commentState = false;
      continue;
    }

    const commentStart = line.indexOf('<!--', cursor);
    if (commentStart === -1) {
      visible += line.slice(cursor);
      break;
    }

    visible += line.slice(cursor, commentStart);
    cursor = commentStart + 4;
    commentState = true;
  }

  return { visible, inComment: commentState };
}

function collectTargets(inputPath) {
  const absolute = path.resolve(inputPath);
  if (!fs.existsSync(absolute)) {
    return [];
  }

  const stat = fs.statSync(absolute);
  if (stat.isFile()) {
    return [absolute];
  }
  if (!stat.isDirectory()) {
    return [];
  }

  const collected = [];
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const entryPath = path.join(absolute, entry.name);
    if (entry.isDirectory()) {
      collected.push(...collectTargets(entryPath));
      continue;
    }
    if (/\.(html?|css|js)$/i.test(entry.name)) {
      collected.push(entryPath);
    }
  }
  return collected;
}

function collectClassTokens(content) {
  const classTokens = new Set();
  const regex = /class\s*=\s*(["'])([\s\S]*?)\1/gi;
  let match;

  while ((match = regex.exec(content)) !== null) {
    match[2].split(/\s+/).filter(Boolean).forEach(token => classTokens.add(token));
  }

  return Array.from(classTokens).sort();
}

function looksLikeUnknownNexledClass(token) {
  if (REGISTRY_CLASS_SET.has(token)) {
    return false;
  }
  return NEXLED_FAMILY_PREFIXES.some(prefix => token === prefix || token.startsWith(`${prefix}-`));
}

function scanAssetReferences(fileContent, violations) {
  const cdnRegex = /https:\/\/ggmtecit-prog\.github\.io\/NexLed_UI_System\/([^\s"')>]+)/gi;
  let match;

  while ((match = cdnRegex.exec(fileContent)) !== null) {
    const ref = match[0];
    if (/\/(?:src\/config-cdn\.js|src\/nexled\.css|src\/nexled\.js)(?:\?v=([0-9.]+))?$/i.test(ref)) {
      const pinMatch = ref.match(/\?v=([0-9.]+)$/i);
      if (!pinMatch || pinMatch[1] !== EXPECTED_PIN) {
        pushViolation(violations, VIOLATIONS.WRONG_CDN_VERSION, 0, 'HIGH', 'error', `NexLed CDN asset must use ?v=${EXPECTED_PIN}: ${ref}`);
      }
      continue;
    }

    if (/\/COMPONENTS\.md(?:\?v=([0-9.]+))?$/i.test(ref)) {
      const pinMatch = ref.match(/\?v=([0-9.]+)$/i);
      if (!pinMatch || pinMatch[1] !== EXPECTED_PIN) {
        pushViolation(violations, VIOLATIONS.WRONG_CDN_VERSION, 0, 'HIGH', 'error', `Published docs link must use ?v=${EXPECTED_PIN}: ${ref}`);
      }
    }
  }
}

function checkHtmlHead(content, violations, requiresJs) {
  const headMatch = content.match(/<head[\s\S]*?<\/head>/i);
  if (!headMatch) {
    pushViolation(violations, VIOLATIONS.MISSING_HEAD_ASSET, 0, 'CRITICAL', 'error', 'Missing <head> block.');
    return;
  }

  const head = headMatch[0];
  const requiredAssets = [
    { label: 'Google Fonts preconnect', token: EXPECTED.fontsPreconnect },
    { label: 'Google Fonts static preconnect', token: EXPECTED.fontsStatic },
    { label: 'Urbanist stylesheet', token: EXPECTED.fontStylesheet },
    { label: 'Remix Icon stylesheet', token: EXPECTED.remix },
    { label: 'Tailwind CDN', token: EXPECTED.tailwind },
    { label: 'config-cdn.js', token: 'config-cdn.js' },
    { label: 'nexled.css', token: 'nexled.css' },
  ];

  requiredAssets.forEach(asset => {
    if (!head.includes(asset.token)) {
      pushViolation(violations, VIOLATIONS.MISSING_HEAD_ASSET, 0, 'CRITICAL', 'error', `Missing required head asset: ${asset.label}.`);
    }
  });

  if (requiresJs && !head.includes('nexled.js')) {
    pushViolation(violations, VIOLATIONS.MISSING_NEXLED_JS, 0, 'CRITICAL', 'error', 'Interactive NexLed components detected but nexled.js is missing from <head>.');
  }

  const orderTokens = [
    EXPECTED.fontsPreconnect,
    EXPECTED.fontsStatic,
    EXPECTED.fontStylesheet,
    EXPECTED.remix,
    EXPECTED.tailwind,
    'config-cdn.js',
    'nexled.css',
  ];

  if (requiresJs) {
    orderTokens.push('nexled.js');
  }

  let lastIndex = -1;
  orderTokens.forEach(token => {
    const idx = head.indexOf(token);
    if (idx !== -1 && idx < lastIndex) {
      pushViolation(violations, VIOLATIONS.WRONG_HEAD_ORDER, 0, 'HIGH', 'error', `Head asset order is invalid around ${token}.`);
    }
    if (idx !== -1) {
      lastIndex = idx;
    }
  });
}

function checkHtmlReferences(content, filePath, violations) {
  const lines = content.split(/\r?\n/);
  let inComment = false;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const commentState = stripHtmlCommentsFromLine(line, inComment);
    const auditLine = commentState.visible;
    inComment = commentState.inComment;

    if (!auditLine.trim()) {
      return;
    }

    if (/<style[\s>]/i.test(auditLine)) {
      pushViolation(violations, VIOLATIONS.STYLE_BLOCK, lineNum, 'CRITICAL', 'error', '<style> blocks are forbidden.', auditLine.trim());
    }

    if (/\sstyle\s*=\s*/i.test(auditLine) && !/<(?:svg|path|circle|rect|line|polyline|polygon)\b/i.test(auditLine)) {
      pushViolation(violations, VIOLATIONS.INLINE_STYLE, lineNum, 'CRITICAL', 'error', 'Inline style attributes are forbidden.', auditLine.trim());
    }

    const arbitraryMatches = auditLine.match(/\b[\w-]+-\[[^\]]+\]/g) || [];
    arbitraryMatches.forEach(matchToken => {
      pushViolation(violations, VIOLATIONS.ARBITRARY_TAILWIND, lineNum, 'HIGH', 'error', `Arbitrary Tailwind value found: ${matchToken}`, auditLine.trim());
    });

    if (/class\s*=\s*["'][^"']*#[0-9a-fA-F]{3,8}[^"']*["']/.test(auditLine)) {
      pushViolation(violations, VIOLATIONS.HARDCODED_HEX, lineNum, 'HIGH', 'error', 'Hardcoded hex values in class attributes are forbidden.', auditLine.trim());
    }

    const inlineHandlers = Array.from(auditLine.matchAll(/\s(on[a-z]+)\s*=\s*/gi));
    inlineHandlers.forEach(matchHandler => {
      if (matchHandler[1].toLowerCase() === 'onerror') {
        return;
      }
      pushViolation(violations, VIOLATIONS.INLINE_EVENT_HANDLER, lineNum, 'HIGH', 'error', `Inline event handler found: ${matchHandler[1]}`, auditLine.trim());
    });

    const attributeMatches = Array.from(auditLine.matchAll(/\s(?:href|src)\s*=\s*"([^"]+)"/gi));
    attributeMatches.forEach(matchRef => {
      const raw = matchRef[1].trim();
      if (!raw || isExternalRef(raw)) {
        return;
      }
      const normalized = normalizeRef(raw);
      if (!normalized) {
        return;
      }
      const targetPath = path.resolve(path.dirname(filePath), normalized);
      if (!fs.existsSync(targetPath) || !hasExactPathCase(targetPath)) {
        pushViolation(violations, VIOLATIONS.BROKEN_LOCAL_REFERENCE, lineNum, 'HIGH', 'error', `Local asset reference does not resolve with exact casing: ${raw}`, auditLine.trim());
      }
    });
  });

  const classTokens = collectClassTokens(content);
  classTokens.filter(looksLikeUnknownNexledClass).forEach(token => {
    pushViolation(violations, VIOLATIONS.UNKNOWN_NEXLED_CLASS, 0, 'HIGH', 'error', `Unknown or outdated NexLed class: ${token}`);
  });
}

function checkCssFile(content, filePath, violations) {
  if (path.basename(filePath).toLowerCase() !== 'nexled.css') {
    pushViolation(violations, VIOLATIONS.LOCAL_CSS_FILE, 0, 'LOW', 'warning', 'Local CSS file detected. Keep consumer projects on NexLed CDN assets unless this file is project-only layout glue.');
  }

  const selectorRegex = /(^|\}|\s)(\.[\w-][\w-]*)(?=[\s\[{.:#>~,]|$)/gm;
  const selectors = new Set();
  let match;

  while ((match = selectorRegex.exec(content)) !== null) {
    selectors.add(match[2].slice(1));
  }

  Array.from(selectors).forEach(token => {
    if (REGISTRY_CLASS_SET.has(token) || looksLikeUnknownNexledClass(token)) {
      pushViolation(violations, VIOLATIONS.LOCAL_COMPONENT_OVERRIDE, 0, 'HIGH', 'error', `Local CSS is targeting NexLed component surface .${token}.`);
    }
  });

  const urlMatches = Array.from(content.matchAll(/url\((['"]?)([^)'"\s]+)\1\)/gi));
  urlMatches.forEach(matchUrl => {
    const raw = matchUrl[2].trim();
    if (!raw || isExternalRef(raw) || raw.startsWith('data:')) {
      return;
    }
    const normalized = normalizeRef(raw);
    const targetPath = path.resolve(path.dirname(filePath), normalized);
    if (!fs.existsSync(targetPath) || !hasExactPathCase(targetPath)) {
      pushViolation(violations, VIOLATIONS.BROKEN_LOCAL_REFERENCE, 0, 'HIGH', 'error', `CSS asset reference does not resolve with exact casing: ${raw}`);
    }
  });
}

function checkJsFile(content, violations) {
  if (/<style[\s>]/i.test(content)) {
    pushViolation(violations, VIOLATIONS.STYLE_BLOCK, 0, 'CRITICAL', 'error', 'Embedded <style> markup detected in JS source.');
  }
  if (/style\s*=\s*["']/.test(content)) {
    pushViolation(violations, VIOLATIONS.INLINE_STYLE, 0, 'HIGH', 'error', 'Embedded inline style markup detected in JS source.');
  }

  const inlineHandlers = Array.from(content.matchAll(/on[a-z]+\s*=\s*["']/gi));
  inlineHandlers.forEach(matchHandler => {
    const handler = matchHandler[0].split('=')[0].trim();
    if (handler.toLowerCase() === 'onerror') {
      return;
    }
    pushViolation(violations, VIOLATIONS.INLINE_EVENT_HANDLER, 0, 'HIGH', 'error', `Embedded inline event handler detected in JS source: ${handler}`);
  });
}

function auditFile(filePath) {
  const absolutePath = path.resolve(filePath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const violations = [];
  const ext = path.extname(filePath).toLowerCase();

  scanAssetReferences(content, violations);

  if (ext === '.html' || ext === '.htm') {
    const requiresJs = INTERACTIVE_HINTS.some(pattern => pattern.test(content));
    checkHtmlHead(content, violations, requiresJs);
    checkHtmlReferences(content, absolutePath, violations);
  } else if (ext === '.css') {
    checkCssFile(content, absolutePath, violations);
  } else if (ext === '.js') {
    checkJsFile(content, violations);
  }

  const errors = violations.filter(item => item.level === 'error');
  const warnings = violations.filter(item => item.level === 'warning');

  return {
    file: path.relative(process.cwd(), absolutePath).replace(/\\/g, '/'),
    violations,
    errors: errors.length,
    warnings: warnings.length,
    passed: errors.length === 0,
  };
}

function formatText(results) {
  let errorCount = 0;
  let warningCount = 0;

  results.forEach(result => {
    console.log('');
    if (result.passed && result.warnings === 0) {
      console.log(`PASS  ${result.file}`);
    } else if (result.passed) {
      console.log(`WARN  ${result.file}  (${result.warnings} warning${result.warnings === 1 ? '' : 's'})`);
    } else {
      console.log(`FAIL  ${result.file}  (${result.errors} error${result.errors === 1 ? '' : 's'}, ${result.warnings} warning${result.warnings === 1 ? '' : 's'})`);
    }

    result.violations.forEach(violation => {
      const lineInfo = violation.line > 0 ? `:${violation.line}` : '';
      console.log(`  [${violation.level.toUpperCase()}][${violation.severity}] ${violation.type}${lineInfo}`);
      console.log(`    ${violation.message}`);
      if (violation.content) {
        console.log(`    > ${violation.content.slice(0, 140)}${violation.content.length > 140 ? '...' : ''}`);
      }
      if (violation.level === 'error') {
        errorCount += 1;
      } else {
        warningCount += 1;
      }
    });
  });

  console.log('');
  console.log('---');
  console.log(`Files checked: ${results.length}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Warnings: ${warningCount}`);
  return errorCount;
}

function main(argv) {
  const args = argv.slice(2);
  const jsonMode = args.includes('--json');
  const inputArgs = args.filter(arg => arg !== '--json');

  if (inputArgs.length === 0) {
    console.log('NexLed Compliance Auditor');
    console.log('========================');
    console.log('Usage: node scripts/audit-compliance.js [--json] <file-or-directory> [...]');
    console.log('');
    console.log('Default enforcement: core fail, drift warn.');
    process.exit(0);
  }

  const targets = Array.from(new Set(inputArgs.flatMap(collectTargets))).sort();
  if (targets.length === 0) {
    console.error('No HTML/CSS/JS files found for the provided input paths.');
    process.exit(1);
  }

  const results = targets.map(auditFile);
  const totalErrors = results.reduce((sum, result) => sum + result.errors, 0);
  const totalWarnings = results.reduce((sum, result) => sum + result.warnings, 0);

  if (jsonMode) {
    console.log(JSON.stringify({
      version: VERSION_META.version,
      complianceMode: VERSION_META.complianceMode,
      filesChecked: results.length,
      errors: totalErrors,
      warnings: totalWarnings,
      results,
    }, null, 2));
  } else {
    formatText(results);
  }

  process.exit(totalErrors > 0 ? 1 : 0);
}

main(process.argv);