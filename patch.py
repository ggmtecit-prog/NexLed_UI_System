"""
NexLed — Universal Patch Runner
================================
Add new patches to the PATCHES list at the bottom of this file.
Run from the ROOT of the NexLed project:

    python patch.py

Each patch is safe to re-run — already-applied patches are skipped.
A .bak backup is created next to each file the FIRST time it is modified.

HOW TO ADD A PATCH
──────────────────
Append a dict to the PATCHES list:

{
    "id":          "short-unique-id",        # used to detect if already applied
    "description": "What this patch does",
    "file":        "path/to/file.ext",       # relative to project root
    "find":        "exact text to find",     # must exist exactly once
    "replace":     "text to replace it with" # what it becomes
}

Rules:
- "id" must be a short unique string that will ONLY appear in the file
  after the patch is applied (used to detect duplicates).
- "find" must match the file content exactly (including indentation).
- Never delete old patches — just append new ones.
"""

import sys
import shutil
from pathlib import Path


# ══════════════════════════════════════════════════════════════════
#  PATCHES — add new entries at the bottom, never remove old ones
# ══════════════════════════════════════════════════════════════════

PATCHES = [

    # ── PATCH 01 ────────────────────────────────────────────────
    {
        "id":          "dropdown-flyout-modifier",
        "description": "Add .dropdown-flyout modifier to nexled.css",
        "file":        "src/nexled.css",
        "find":        "/* BREADCRUMBS */",
        "replace": """\
/* DROPDOWN — FLYOUT PANEL MODIFIER */
/* dropdown-flyout-modifier */
.dropdown-flyout .dropdown-menu {
  right: auto;
  min-width: 0;
  max-height: none;
  padding: 0;
  overflow: visible;
  width: calc(var(--space-64) * 14);
  left: 50%;
  transform: translateX(-50%) translateY(var(--press-offset));
}

.dropdown-flyout.is-open .dropdown-menu {
  transform: translateX(-50%) translateY(var(--radius-none));
}

/* BREADCRUMBS */""",
    },

    # ── PATCH 02 ────────────────────────────────────────────────
    {
        "id":          "variant2-nav-flyout-features",
        "description": "Replace Variant 2 nav dropdowns with flyout-features panels",
        "file":        "organisms.html",
        "find": """\
                            <!-- Navigation Dropdowns -->
                            <nav class="hidden md:flex items-center gap-24 h-full">
                                <div class="dropdown dropdown-minimal dropdown-xs w-btn-xs">
                                    <button class="dropdown-trigger" aria-haspopup="listbox" aria-expanded="false">
                                        <span class="dropdown-value">Components</span>
                                        <i class="ri-arrow-down-s-line dropdown-arrow" aria-hidden="true"></i>
                                    </button>
                                    <ul class="dropdown-menu custom-scrollbar" role="listbox"
                                        aria-label="Components navigation">
                                        <li class="dropdown-item" role="option" aria-selected="false"
                                            data-value="atoms">
                                            <span>Atoms</span>
                                            <i class="ri-check-line dropdown-item-check" aria-hidden="true"></i>
                                        </li>
                                        <li class="dropdown-item" role="option" aria-selected="false"
                                            data-value="molecules">
                                            <span>Molecules</span>
                                            <i class="ri-check-line dropdown-item-check" aria-hidden="true"></i>
                                        </li>
                                        <li class="dropdown-item" role="option" aria-selected="false"
                                            data-value="organisms">
                                            <span>Organisms</span>
                                            <i class="ri-check-line dropdown-item-check" aria-hidden="true"></i>
                                        </li>
                                    </ul>
                                </div>


                                <div class="dropdown dropdown-minimal dropdown-xs w-btn-xs">
                                    <button class="dropdown-trigger" aria-haspopup="listbox" aria-expanded="false">
                                        <span class="dropdown-value">Resources</span>
                                        <i class="ri-arrow-down-s-line dropdown-arrow" aria-hidden="true"></i>
                                    </button>
                                    <ul class="dropdown-menu custom-scrollbar" role="listbox"
                                        aria-label="Resources navigation">
                                        <li class="dropdown-item" role="option" aria-selected="false"
                                            data-value="tokens">
                                            <span>Design Tokens</span>
                                            <i class="ri-check-line dropdown-item-check" aria-hidden="true"></i>
                                        </li>
                                    </ul>
                                </div>
                            </nav>""",
        "replace": """\
                            <!-- Navigation Dropdowns — variant2-nav-flyout-features -->
                            <nav class="hidden md:flex items-center gap-24 h-full">

                                <!-- Components — Flyout Features Panel -->
                                <div class="dropdown dropdown-minimal dropdown-xs dropdown-flyout">
                                    <button class="dropdown-trigger" aria-haspopup="dialog" aria-expanded="false">
                                        <span class="dropdown-value">Components</span>
                                        <i class="ri-arrow-down-s-line dropdown-arrow" aria-hidden="true"></i>
                                    </button>
                                    <div class="dropdown-menu flyout flyout-features" role="dialog" aria-label="Components navigation">
                                        <div class="flyout-body">
                                            <div class="flyout-copy">
                                                <div class="flyout-grid">
                                                    <a href="#" class="flyout-link">
                                                        <span class="flyout-media"><i class="ri-archive-line" aria-hidden="true"></i></span>
                                                        <div>
                                                            <h4 class="flyout-title">Curabitur maximus</h4>
                                                            <p class="flyout-text">Aliquam sapien felis, tincidunt non fermentum ac, accumsan eget eros</p>
                                                        </div>
                                                    </a>
                                                    <a href="#" class="flyout-link">
                                                        <span class="flyout-media"><i class="ri-archive-line" aria-hidden="true"></i></span>
                                                        <div>
                                                            <h4 class="flyout-title">Curabitur maximus</h4>
                                                            <p class="flyout-text">Aliquam sapien felis, tincidunt non fermentum ac, accumsan eget eros</p>
                                                        </div>
                                                    </a>
                                                    <a href="#" class="flyout-link">
                                                        <span class="flyout-media"><i class="ri-archive-line" aria-hidden="true"></i></span>
                                                        <div>
                                                            <h4 class="flyout-title">Curabitur maximus</h4>
                                                            <p class="flyout-text">Aliquam sapien felis, tincidunt non fermentum ac, accumsan eget eros</p>
                                                        </div>
                                                    </a>
                                                    <a href="#" class="flyout-link">
                                                        <span class="flyout-media"><i class="ri-archive-line" aria-hidden="true"></i></span>
                                                        <div>
                                                            <h4 class="flyout-title">Curabitur maximus</h4>
                                                            <p class="flyout-text">Aliquam sapien felis, tincidunt non fermentum ac, accumsan eget eros</p>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Resources — Flyout Features Panel -->
                                <div class="dropdown dropdown-minimal dropdown-xs dropdown-flyout">
                                    <button class="dropdown-trigger" aria-haspopup="dialog" aria-expanded="false">
                                        <span class="dropdown-value">Resources</span>
                                        <i class="ri-arrow-down-s-line dropdown-arrow" aria-hidden="true"></i>
                                    </button>
                                    <div class="dropdown-menu flyout flyout-features" role="dialog" aria-label="Resources navigation">
                                        <div class="flyout-body">
                                            <div class="flyout-copy">
                                                <div class="flyout-grid">
                                                    <a href="#" class="flyout-link">
                                                        <span class="flyout-media"><i class="ri-archive-line" aria-hidden="true"></i></span>
                                                        <div>
                                                            <h4 class="flyout-title">Curabitur maximus</h4>
                                                            <p class="flyout-text">Aliquam sapien felis, tincidunt non fermentum ac, accumsan eget eros</p>
                                                        </div>
                                                    </a>
                                                    <a href="#" class="flyout-link">
                                                        <span class="flyout-media"><i class="ri-archive-line" aria-hidden="true"></i></span>
                                                        <div>
                                                            <h4 class="flyout-title">Curabitur maximus</h4>
                                                            <p class="flyout-text">Aliquam sapien felis, tincidunt non fermentum ac, accumsan eget eros</p>
                                                        </div>
                                                    </a>
                                                    <a href="#" class="flyout-link">
                                                        <span class="flyout-media"><i class="ri-archive-line" aria-hidden="true"></i></span>
                                                        <div>
                                                            <h4 class="flyout-title">Curabitur maximus</h4>
                                                            <p class="flyout-text">Aliquam sapien felis, tincidunt non fermentum ac, accumsan eget eros</p>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </nav>""",
    },

    # ── PATCH 03 ────────────────────────────────────────────────
    {
        "id":          "language-selector-xs-css",
        "description": "Add language-selector-xs size variant to nexled.css",
        "file":        "src/nexled.css",
        "find":        "/* FLYOUT */",
        "replace": """\
/* LANGUAGE SELECTOR — XS SIZE */
/* language-selector-xs-css */
.language-selector-xs .language-selector-trigger {
  height: var(--size-btn-xs-h);
  padding-block: var(--space-8);
  padding-inline: var(--space-12);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-body-xs);
  line-height: var(--line-height-body-xs);
}

.language-selector-xs .language-selector-current {
  gap: var(--space-8);
}

.language-selector-icon.language-selector-xs .language-selector-trigger {
  gap: var(--space-8);
}

.language-selector-xs .language-selector-value {
  font-size: var(--font-size-body-xs);
  line-height: var(--line-height-body-xs);
}

.language-selector-xs .language-selector-flag {
  width: var(--space-20);
  height: var(--space-20);
}

.language-selector-xs .language-selector-arrow {
  font-size: var(--space-12);
}

.language-selector-xs .language-selector-menu {
  padding: var(--space-4);
  gap: var(--space-4);
  max-height: calc(var(--size-btn-xs-h) * 4);
}

.language-selector-xs .language-selector-option {
  gap: var(--space-8);
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-body-xs);
  line-height: var(--line-height-body-xs);
}

.language-selector-xs .language-selector-check {
  font-size: var(--space-12);
}

.language-selector-standard.language-selector-xs {
  --language-selector-trigger-width: var(--size-btn-xs-w);
  --language-selector-menu-width: var(--size-btn-xs-w);
}

.language-selector-icon.language-selector-xs {
  --language-selector-trigger-width: calc((var(--space-8) * 2) + var(--space-20) + var(--space-8) + var(--space-12));
  --language-selector-menu-width: var(--size-btn-xs-w);
}

/* FLYOUT */""",
    },

    # ── PATCH 04 ────────────────────────────────────────────────
    {
        "id":          "language-selector-xs-standard-html",
        "description": "Add xs row to Standard column in language selector section",
        "file":        "molecules.html",
        "find": """\
                        <div class="size-grid-column">
                            <h3 class="size-grid-column-title">Standard</h3>

                            <div class="size-grid-row">
                                <h4 class="size-grid-label">Small</h4>""",
        "replace": """\
                        <div class="size-grid-column">
                            <h3 class="size-grid-column-title">Standard</h3>

                            <!-- language-selector-xs-standard-html -->
                            <div class="size-grid-row">
                                <h4 class="size-grid-label">Extra Small</h4>
                                <div class="size-grid-content">
                                    <div class="language-selector language-selector-standard language-selector-xs has-value">
                                        <button type="button" class="language-selector-trigger" aria-haspopup="listbox"
                                            aria-expanded="false" aria-label="Current language: English">
                                            <span class="language-selector-current">
                                                <img class="language-selector-flag" src="https://flagcdn.com/w40/gb.png"
                                                    srcset="https://flagcdn.com/w80/gb.png 2x" width="20" height="20"
                                                    alt="">
                                                <span class="language-selector-value">English</span>
                                            </span>
                                            <i class="ri-arrow-down-s-line language-selector-arrow" aria-hidden="true"></i>
                                        </button>
                                        <ul class="language-selector-menu custom-scrollbar" role="listbox"
                                            aria-label="Standard extra small language options">
                                            <li class="language-selector-option" role="option" aria-selected="true"
                                                data-code="gb">
                                                <img class="language-selector-flag" src="https://flagcdn.com/w40/gb.png"
                                                    srcset="https://flagcdn.com/w80/gb.png 2x" width="20" height="20"
                                                    alt="">
                                                <span>English</span>
                                                <i class="ri-check-line language-selector-check" aria-hidden="true"></i>
                                            </li>
                                            <li class="language-selector-option" role="option" aria-selected="false"
                                                data-code="pt">
                                                <img class="language-selector-flag" src="https://flagcdn.com/w40/pt.png"
                                                    srcset="https://flagcdn.com/w80/pt.png 2x" width="20" height="20"
                                                    alt="">
                                                <span>Portugu&#234;s</span>
                                                <i class="ri-check-line language-selector-check" aria-hidden="true"></i>
                                            </li>
                                            <li class="language-selector-option" role="option" aria-selected="false"
                                                data-code="es">
                                                <img class="language-selector-flag" src="https://flagcdn.com/w40/es.png"
                                                    srcset="https://flagcdn.com/w80/es.png 2x" width="20" height="20"
                                                    alt="">
                                                <span>Espa&#241;ol</span>
                                                <i class="ri-check-line language-selector-check" aria-hidden="true"></i>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="size-grid-row">
                                <h4 class="size-grid-label">Small</h4>""",
    },

    # ── PATCH 05 ────────────────────────────────────────────────
    {
        "id":          "language-selector-xs-icon-html",
        "description": "Add xs row to Icon Only column in language selector section",
        "file":        "molecules.html",
        "find": """\
                        <div class="size-grid-column">
                            <h3 class="size-grid-column-title">Icon Only</h3>

                            <div class="size-grid-row">
                                <h4 class="size-grid-label">Small</h4>""",
        "replace": """\
                        <div class="size-grid-column">
                            <h3 class="size-grid-column-title">Icon Only</h3>

                            <!-- language-selector-xs-icon-html -->
                            <div class="size-grid-row">
                                <h4 class="size-grid-label">Extra Small</h4>
                                <div class="size-grid-content">
                                    <div class="language-selector language-selector-icon language-selector-xs has-value">
                                        <button type="button" class="language-selector-trigger" aria-haspopup="listbox"
                                            aria-expanded="false" aria-label="Current language: English">
                                            <span class="language-selector-current">
                                                <img class="language-selector-flag" src="https://flagcdn.com/w40/gb.png"
                                                    srcset="https://flagcdn.com/w80/gb.png 2x" width="20" height="20"
                                                    alt="">
                                            </span>
                                            <i class="ri-arrow-down-s-line language-selector-arrow" aria-hidden="true"></i>
                                        </button>
                                        <ul class="language-selector-menu custom-scrollbar" role="listbox"
                                            aria-label="Icon-only extra small language options">
                                            <li class="language-selector-option" role="option" aria-selected="true"
                                                data-code="gb">
                                                <img class="language-selector-flag" src="https://flagcdn.com/w40/gb.png"
                                                    srcset="https://flagcdn.com/w80/gb.png 2x" width="20" height="20"
                                                    alt="">
                                                <span>English</span>
                                                <i class="ri-check-line language-selector-check" aria-hidden="true"></i>
                                            </li>
                                            <li class="language-selector-option" role="option" aria-selected="false"
                                                data-code="pt">
                                                <img class="language-selector-flag" src="https://flagcdn.com/w40/pt.png"
                                                    srcset="https://flagcdn.com/w80/pt.png 2x" width="20" height="20"
                                                    alt="">
                                                <span>Portugu&#234;s</span>
                                                <i class="ri-check-line language-selector-check" aria-hidden="true"></i>
                                            </li>
                                            <li class="language-selector-option" role="option" aria-selected="false"
                                                data-code="es">
                                                <img class="language-selector-flag" src="https://flagcdn.com/w40/es.png"
                                                    srcset="https://flagcdn.com/w80/es.png 2x" width="20" height="20"
                                                    alt="">
                                                <span>Espa&#241;ol</span>
                                                <i class="ri-check-line language-selector-check" aria-hidden="true"></i>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="size-grid-row">
                                <h4 class="size-grid-label">Small</h4>""",
    },

    # ── ADD NEW PATCHES BELOW THIS LINE ─────────────────────────
    # Copy the template above, give it a unique "id", and append here.

]


# ══════════════════════════════════════════════════════════════════
#  ENGINE — do not edit below this line
# ══════════════════════════════════════════════════════════════════

def detect_eol(raw: bytes) -> str:
    return "\r\n" if b"\r\n" in raw else "\n"

def apply_patch(patch: dict) -> str:
    pid   = patch["id"]
    desc  = patch["description"]
    fpath = Path(patch["file"])
    find  = patch["find"]
    repl  = patch["replace"]

    print(f"\n  [{pid}]")
    print(f"  {desc}")

    if not fpath.exists():
        print(f"  ✖ ERROR: {fpath} not found.")
        sys.exit(1)

    raw  = fpath.read_bytes()
    eol  = detect_eol(raw)
    text = raw.decode("utf-8").replace("\r\n", "\n")

    if pid in text:
        print(f"  ⚠  Already applied — skipped.")
        return "skipped"

    find_norm = find.replace("\r\n", "\n")

    if find_norm not in text:
        print(f"  ✖ ERROR: 'find' string not found in {fpath}.")
        print(f"    The file may already be modified or indentation differs.")
        sys.exit(1)

    bak = fpath.with_suffix(fpath.suffix + ".bak")
    if not bak.exists():
        shutil.copy2(fpath, bak)
        print(f"  ✔ Backup → {bak}")

    patched = text.replace(find_norm, repl, 1)

    if eol == "\r\n":
        patched = patched.replace("\n", "\r\n")

    fpath.write_bytes(patched.encode("utf-8"))
    print(f"  ✔ Applied.")
    return "applied"


if __name__ == "__main__":
    print("=" * 56)
    print("  NexLed — Patch Runner")
    print(f"  {len(PATCHES)} patch(es) registered")
    print("=" * 56)

    applied = skipped = 0

    for patch in PATCHES:
        result = apply_patch(patch)
        if result == "applied":
            applied += 1
        else:
            skipped += 1

    print("\n" + "=" * 56)
    print(f"  ✅  Done — {applied} applied, {skipped} skipped.")
    print("=" * 56)