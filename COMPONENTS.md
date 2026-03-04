# PROMPT — Rebuild COMPONENTS.md from source

## Your job
Rebuild `COMPONENTS.md` from scratch by reading the actual source files in this repo.
Do not use any hardcoded values. Do not copy from the existing COMPONENTS.md.
Every value, class name, snippet, and structure must be derived from what you read.

---

## Step 1 — Read these files first

Read all of these before writing a single line:

1. `src/nexled.css` — every component class, variant, size, and state that exists
2. `src/config-cdn.js` — every token name available
3. `atoms.html` — read every `<pre><code id="snippet-*">` block for canonical HTML
4. `molecules.html` — same
5. `organisms.html` — same

The snippet blocks inside the HTML pages are the canonical source of truth for
correct component HTML. Use them exactly as they are — do not rewrite or simplify them.

---

## Step 2 — For each component, extract

From `nexled.css`:
- The core class name
- Every variant class (read the actual selectors)
- Every size class (read the actual selectors)
- Every state hook (`:hover`, `:disabled`, `aria-*`, `.is-open`, etc.)

From the HTML snippet blocks:
- The exact canonical HTML as written in the snippet

If a component has a snippet in the HTML pages → use that snippet verbatim.
If a component exists in `nexled.css` but has no snippet in the HTML pages → flag it
with a comment: `<!-- No snippet found — ask user for correct HTML -->`
and leave the snippet block empty for the user to fill in.

---

## Step 3 — For components with no nexled.css class

Some components in the HTML pages are built with utility classes only
(carousel, file uploader, quantity selector, etc.).
For these, note clearly:
- "No dedicated nexled.css class"
- List what structural helper classes are used (read from the snippet)
- Copy the snippet verbatim

---

## Step 4 — Structure of COMPONENTS.md

Build the file with this structure:

```
# NexLed Components Reference
(brief intro: source files, extraction rule, how to use)

## Source Index
(list every component with its snippet ID)

## Atoms
(one section per component)

## Molecules
(one section per component)

## Organisms
(one section per component)
```

For each component section include:
- Source file and snippet ID
- Core class (from nexled.css)
- Variants (from nexled.css)
- Sizes (from nexled.css)
- State hooks (from nexled.css)
- Canonical HTML snippet (from the HTML page snippet block)

---

## Step 5 — Before saving, ask the user

Before writing the final file, output a list of:

1. Every component where a snippet was found and extracted — mark as ✅
2. Every component in nexled.css with no HTML snippet — mark as ⚠️ MISSING SNIPPET
3. Every component in the HTML with no nexled.css class — mark as 📌 UTILITY ONLY

Then ask:
> "For the ⚠️ MISSING SNIPPET components listed above, please provide the correct
> HTML or confirm I should leave them empty. Ready to write COMPONENTS.md once confirmed."

Wait for the user's response before saving the file.

---

## Rules

- Never copy from the existing COMPONENTS.md — read only from source files
- Never invent a class name — only use what exists in nexled.css
- Never invent token values — only use what exists in config-cdn.js
- Snippets must match what is in the HTML pages exactly — do not clean them up
- If something is unclear → flag it, do not guess