#!/usr/bin/env node

/**
 * NexLed Compliance Auditor
 * Checks HTML files for NexLed Design System compliance.
 *
 * Usage: node scripts/audit-compliance.js <file.html> [file2.html ...]
 * Example: node scripts/audit-compliance.js index.html Atoms.html
 */

const fs = require('fs');
const path = require('path');

const VIOLATIONS = {
    STYLE_BLOCK: 'STYLE_BLOCK',
    INLINE_STYLE: 'INLINE_STYLE',
    ARBITRARY_TAILWIND: 'ARBITRARY_TAILWIND',
    HARDCODED_HEX: 'HARDCODED_HEX',
    MISSING_CDN_CONFIG: 'MISSING_CDN_CONFIG',
    MISSING_CDN_CSS: 'MISSING_CDN_CSS',
    MISSING_TAILWIND: 'MISSING_TAILWIND',
    MISSING_FONTS: 'MISSING_FONTS',
    WRONG_HEAD_ORDER: 'WRONG_HEAD_ORDER',
    INLINE_EVENT_HANDLER: 'INLINE_EVENT_HANDLER',
    BROKEN_LOCAL_LINK: 'BROKEN_LOCAL_LINK',
};

function hasExactPathCase(targetPath) {
    const resolvedPath = path.resolve(targetPath);
    const parsed = path.parse(resolvedPath);

    if (!fs.existsSync(resolvedPath)) {
        return false;
    }

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

function isExternalHref(href) {
    return /^(?:[a-z]+:|#|\/\/)/i.test(href);
}

function normalizeHrefTarget(href) {
    return href.split('#')[0].split('?')[0];
}

function stripHtmlCommentsFromLine(line, inComment) {
    let visible = '';
    let cursor = 0;
    let commentState = inComment;

    while (cursor < line.length) {
        if (commentState) {
            const commentEnd = line.indexOf('-->', cursor);
            if (commentEnd === -1) {
                return {
                    visible,
                    inComment: true,
                };
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

    return {
        visible,
        inComment: commentState,
    };
}

function auditFile(filePath) {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
        console.error(`File not found: ${absolutePath}`);
        return null;
    }

    const content = fs.readFileSync(absolutePath, 'utf-8');
    const lines = content.split('\n');
    const violations = [];
    let inHtmlComment = false;

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const commentState = stripHtmlCommentsFromLine(line, inHtmlComment);
        const auditLine = commentState.visible;
        inHtmlComment = commentState.inComment;

        if (!auditLine.trim()) {
            return;
        }

        if (/<style[\s>]/i.test(auditLine)) {
            violations.push({
                type: VIOLATIONS.STYLE_BLOCK,
                line: lineNum,
                severity: 'CRITICAL',
                message: '<style> block found - all styling must come from nexled.css',
                content: auditLine.trim(),
            });
        }

        if (/\sstyle\s*=/i.test(auditLine) && !/<svg/i.test(auditLine) && !/<path/i.test(auditLine) && !/<circle/i.test(auditLine)) {
            violations.push({
                type: VIOLATIONS.INLINE_STYLE,
                line: lineNum,
                severity: 'CRITICAL',
                message: 'Inline style="" attribute found - use NexLed classes instead',
                content: auditLine.trim(),
            });
        }

        const arbitraryMatch = auditLine.match(/class="[^"]*\b\w+-\[[^\]]+\][^"]*"/g);
        if (arbitraryMatch) {
            arbitraryMatch.forEach(match => {
                const arbitraries = match.match(/\b[\w-]+-\[[^\]]+\]/g);
                if (arbitraries) {
                    arbitraries.forEach(arb => {
                        violations.push({
                            type: VIOLATIONS.ARBITRARY_TAILWIND,
                            line: lineNum,
                            severity: 'HIGH',
                            message: `Arbitrary Tailwind value "${arb}" found - use a config-cdn.js token instead`,
                            content: auditLine.trim(),
                        });
                    });
                }
            });
        }

        const hexInClass = auditLine.match(/class="[^"]*#[0-9a-fA-F]{3,8}[^"]*"/g);
        if (hexInClass) {
            violations.push({
                type: VIOLATIONS.HARDCODED_HEX,
                line: lineNum,
                severity: 'HIGH',
                message: 'Hardcoded hex color in class attribute found - use NexLed color token names',
                content: auditLine.trim(),
            });
        }

        const inlineHandlers = Array.from(auditLine.matchAll(/\s(on[a-z]+)\s*=/gi));
        inlineHandlers.forEach(match => {
            const handlerName = match[1].toLowerCase();
            if (handlerName === 'onerror') {
                return;
            }

            violations.push({
                type: VIOLATIONS.INLINE_EVENT_HANDLER,
                line: lineNum,
                severity: 'HIGH',
                message: `Inline event handler "${handlerName}" found - move behavior into shared JS`,
                content: auditLine.trim(),
            });
        });

        const hrefMatches = Array.from(auditLine.matchAll(/\shref\s*=\s*"([^"]+)"/gi));
        hrefMatches.forEach(match => {
            const href = match[1].trim();
            if (!href || isExternalHref(href)) {
                return;
            }

            const normalizedHref = normalizeHrefTarget(href);
            if (!/\.html?$/i.test(normalizedHref)) {
                return;
            }

            const targetPath = path.resolve(path.dirname(absolutePath), normalizedHref);
            if (!fs.existsSync(targetPath) || !hasExactPathCase(targetPath)) {
                violations.push({
                    type: VIOLATIONS.BROKEN_LOCAL_LINK,
                    line: lineNum,
                    severity: 'MEDIUM',
                    message: `Local href "${href}" does not resolve with exact path casing`,
                    content: auditLine.trim(),
                });
            }
        });
    });

    const headMatch = content.match(/<head[\s\S]*?<\/head>/i);
    if (headMatch) {
        const head = headMatch[0];

        if (!head.includes('cdn.tailwindcss.com')) {
            violations.push({
                type: VIOLATIONS.MISSING_TAILWIND,
                line: 0,
                severity: 'CRITICAL',
                message: 'Tailwind CDN script not found in <head>',
                content: '',
            });
        }

        if (!head.includes('config-cdn.js')) {
            violations.push({
                type: VIOLATIONS.MISSING_CDN_CONFIG,
                line: 0,
                severity: 'CRITICAL',
                message: 'config-cdn.js not found in <head> - NexLed tokens will not load',
                content: '',
            });
        }

        if (!head.includes('nexled.css')) {
            violations.push({
                type: VIOLATIONS.MISSING_CDN_CSS,
                line: 0,
                severity: 'CRITICAL',
                message: 'nexled.css not found in <head> - NexLed components will not load',
                content: '',
            });
        }

        if (!head.includes('fonts.googleapis.com') || !head.includes('Urbanist')) {
            violations.push({
                type: VIOLATIONS.MISSING_FONTS,
                line: 0,
                severity: 'MEDIUM',
                message: 'Urbanist font from Google Fonts not found in <head>',
                content: '',
            });
        }

        const tailwindPos = head.indexOf('cdn.tailwindcss.com');
        const configPos = head.indexOf('config-cdn.js');
        const cssPos = head.indexOf('nexled.css');

        if (tailwindPos > -1 && configPos > -1 && tailwindPos > configPos) {
            violations.push({
                type: VIOLATIONS.WRONG_HEAD_ORDER,
                line: 0,
                severity: 'HIGH',
                message: 'Tailwind CDN must load before config-cdn.js',
                content: '',
            });
        }

        if (configPos > -1 && cssPos > -1 && configPos > cssPos) {
            violations.push({
                type: VIOLATIONS.WRONG_HEAD_ORDER,
                line: 0,
                severity: 'HIGH',
                message: 'config-cdn.js must load before nexled.css',
                content: '',
            });
        }
    }

    return {
        file: filePath,
        violations,
        passed: violations.length === 0,
    };
}

const files = process.argv.slice(2);

if (files.length === 0) {
    console.log('NexLed Compliance Auditor');
    console.log('========================');
    console.log('Usage: node scripts/audit-compliance.js <file.html> [file2.html ...]');
    console.log('');
    console.log('Checks:');
    console.log('  - No <style> blocks');
    console.log('  - No inline style="" attributes');
    console.log('  - No arbitrary Tailwind values (for example, w-[320px])');
    console.log('  - No hardcoded hex colors in class attributes');
    console.log('  - Required <head> block elements present and in order');
    console.log('  - No inline event handlers except approved onerror asset fallbacks');
    console.log('  - Local HTML href values resolve with exact path casing');
    process.exit(0);
}

let totalViolations = 0;

files.forEach(file => {
    const result = auditFile(file);
    if (!result) {
        return;
    }

    console.log('');
    if (result.passed) {
        console.log(`PASS  ${result.file}`);
    } else {
        console.log(`FAIL  ${result.file}  (${result.violations.length} violation${result.violations.length > 1 ? 's' : ''})`);
        result.violations.forEach(violation => {
            const lineInfo = violation.line > 0 ? `:${violation.line}` : '';
            console.log(`  [${violation.severity}] ${violation.type}${lineInfo}`);
            console.log(`    ${violation.message}`);
            if (violation.content) {
                console.log(`    > ${violation.content.substring(0, 120)}${violation.content.length > 120 ? '...' : ''}`);
            }
        });
        totalViolations += result.violations.length;
    }
});

console.log('');
console.log('---');
if (totalViolations === 0) {
    console.log(`All ${files.length} file(s) passed compliance checks.`);
} else {
    console.log(`${totalViolations} total violation(s) found across ${files.length} file(s).`);
}

process.exit(totalViolations > 0 ? 1 : 0);