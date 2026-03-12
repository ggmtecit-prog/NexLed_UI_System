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

        # ── FIND ────────────────────────────────────────────────
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

        # ── REPLACE ─────────────────────────────────────────────
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

    # ── ADD NEW PATCHES BELOW THIS LINE ─────────────────────────
    # Copy the template above, give it a unique "id", and append here.

]


# ══════════════════════════════════════════════════════════════════
#  ENGINE — do not edit below this line
# ══════════════════════════════════════════════════════════════════

def detect_eol(raw: bytes) -> str:
    return "\r\n" if b"\r\n" in raw else "\n"

def apply_patch(patch: dict) -> str:
    """Returns 'applied', 'skipped', or raises SystemExit on error."""
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

    # Already applied?
    if pid in text:
        print(f"  ⚠  Already applied — skipped.")
        return "skipped"

    # Normalise find string too (in case this file uses CRLF)
    find_norm = find.replace("\r\n", "\n")

    if find_norm not in text:
        print(f"  ✖ ERROR: 'find' string not found in {fpath}.")
        print(f"    The file may already be modified or indentation differs.")
        sys.exit(1)

    # Backup only on first modification of this file
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
