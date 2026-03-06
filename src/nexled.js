/**
 * Accordion Component Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const content = trigger.nextElementSibling;
            const icon = trigger.querySelector('.chevron-icon');
            const span = trigger.querySelector('span');

            // Toggle current
            trigger.setAttribute('aria-expanded', !isExpanded);

            if (!isExpanded) {
                // Expand
                content.classList.remove('max-h-0', 'opacity-0');
                content.classList.add('opacity-100');
                icon.classList.add('rotate-180', 'text-black');
                icon.classList.remove('text-grey-primary');
                span.classList.add('text-black');
                span.classList.remove('text-grey-primary');
            } else {
                // Collapse
                content.classList.add('max-h-0', 'opacity-0');
                content.classList.remove('opacity-100');
                icon.classList.remove('rotate-180', 'text-black');
                icon.classList.add('text-grey-primary');
                span.classList.remove('text-black');
                span.classList.add('text-grey-primary');
            }

            // Optional: Close others in the same group (solo mode)
            // Uncomment to enable only-one-open-at-a-time behavior
            /*
            if (!isExpanded) {
                accordionTriggers.forEach(otherTrigger => {
                    if (otherTrigger !== trigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
                        otherTrigger.click();
                    }
                });
            }
            */
        });
    });
});


/**
 * Announcement Bar Component Logic
 */

function closeBar(id) {
    const bar = document.getElementById(id);
    if (!bar) return;

    // Smooth collapse animation
    // Note: CSS classes handle ease-premium, JS triggers the state change
    bar.style.opacity = "0";
    bar.style.transform = "translateY(-100%)";
    bar.style.marginTop = `-${bar.offsetHeight}px`;

    // Remove from DOM after animation (400ms match)
    setTimeout(() => {
        bar.style.display = 'none';
    }, 400);
}


/* ============================================================
   Dropdown Menu Component Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Single-select dropdowns
    const singleDropdowns = document.querySelectorAll('.dropdown:not(.dropdown--disabled):not(.dropdown--multi)');
    // Multi-select dropdowns
    const multiDropdowns = document.querySelectorAll('.dropdown--multi:not(.dropdown--disabled)');

    // Single-select behavior
    singleDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown__trigger');
        const items = dropdown.querySelectorAll('.dropdown__item');
        const valueDisplay = dropdown.querySelector('.dropdown__value');

        trigger.addEventListener('click', () => {
            const isOpen = dropdown.classList.contains('open');
            closeAllDropdowns();
            if (!isOpen) {
                dropdown.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
                dropdown.querySelector('.dropdown__menu').classList.remove('opacity-0', 'invisible', '-translate-y-2');
                dropdown.querySelector('.dropdown__menu').classList.add('opacity-100', 'visible', 'translate-y-0');
                dropdown.querySelector('.dropdown__arrow').classList.add('rotate-180');
            }
        });

        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(i => {
                    i.removeAttribute('aria-selected');
                    i.classList.remove('text-green-secondary', 'font-semibold', 'bg-green-hover-text');
                });
                item.setAttribute('aria-selected', 'true');
                item.classList.add('text-green-secondary', 'font-semibold', 'bg-green-hover-text');

                // Add checkmark using Remix icon
                items.forEach(i => {
                    const existingCheck = i.querySelector('.ri-check-line');
                    if (existingCheck) existingCheck.remove();
                });
                const checkmark = document.createElement('i');
                checkmark.className = 'ri-check-line ml-auto text-lg';
                item.appendChild(checkmark);

                valueDisplay.textContent = item.textContent.replace('', '').trim();
                valueDisplay.classList.remove('text-grey-primary');
                valueDisplay.classList.add('text-black');
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
                dropdown.querySelector('.dropdown__menu').classList.add('opacity-0', 'invisible', '-translate-y-2');
                dropdown.querySelector('.dropdown__menu').classList.remove('opacity-100', 'visible', 'translate-y-0');
                dropdown.querySelector('.dropdown__arrow').classList.remove('rotate-180');
            });
        });

        setupKeyboardNav(dropdown, trigger, items);
    });

    // Multi-select behavior
    multiDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown__trigger');
        const items = dropdown.querySelectorAll('.dropdown__item');
        const valueDisplay = dropdown.querySelector('.dropdown__value');

        trigger.addEventListener('click', () => {
            const isOpen = dropdown.classList.contains('open');
            closeAllDropdowns();
            if (!isOpen) {
                dropdown.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
                dropdown.querySelector('.dropdown__menu').classList.remove('opacity-0', 'invisible', '-translate-y-2');
                dropdown.querySelector('.dropdown__menu').classList.add('opacity-100', 'visible', 'translate-y-0');
                dropdown.querySelector('.dropdown__arrow').classList.add('rotate-180');
            }
        });

        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();

                // Find the checkbox input within this item
                const checkbox = item.querySelector('input[type="checkbox"]');
                if (!checkbox) return;

                // Toggle the checkbox
                checkbox.checked = !checkbox.checked;

                // Update aria-selected to match checkbox state
                item.setAttribute('aria-selected', String(checkbox.checked));

                // Add/remove selected styling to the item
                if (checkbox.checked) {
                    item.classList.add('bg-green-hover-text');
                } else {
                    item.classList.remove('bg-green-hover-text');
                }

                updateMultiValue(dropdown, valueDisplay);
            });
        });

        setupKeyboardNav(dropdown, trigger, items, true);
    });

    function updateMultiValue(dropdown, valueDisplay) {
        const selected = dropdown.querySelectorAll('.dropdown__item[aria-selected="true"]');
        if (selected.length === 0) {
            valueDisplay.textContent = 'Select options';
            valueDisplay.classList.add('text-grey-primary');
            valueDisplay.classList.remove('text-black');
        } else if (selected.length === 1) {
            valueDisplay.textContent = selected[0].textContent;
            valueDisplay.classList.remove('text-grey-primary');
            valueDisplay.classList.add('text-black');
        } else {
            valueDisplay.textContent = `${selected.length} selected`;
            valueDisplay.classList.remove('text-grey-primary');
            valueDisplay.classList.add('text-black');
        }
    }

    function setupKeyboardNav(dropdown, trigger, items, isMulti = false) {
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!dropdown.classList.contains('open')) {
                    trigger.click();
                    items[0]?.focus();
                }
            }

            // Open menu and focus last item on ArrowUp from trigger
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!dropdown.classList.contains('open')) {
                    trigger.click();
                    items[items.length - 1]?.focus();
                }
            }

            if (e.key === 'Escape') {
                closeDropdown(dropdown);
            }
        });

        items.forEach((item, index) => {
            item.setAttribute('tabindex', '-1');

            // Ensure focused item is visible (works across sizes)
            item.addEventListener('focus', () => {
                item.scrollIntoView({ block: 'nearest' });
            });

            item.addEventListener('keydown', (e) => {
                // Wrap navigation: ArrowDown -> next (wrap to first), ArrowUp -> prev (wrap to last)
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (index === items.length - 1) {
                        items[0]?.focus();
                    } else {
                        items[index + 1]?.focus();
                    }
                }

                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (index === 0) {
                        items[items.length - 1]?.focus();
                    } else {
                        items[index - 1]?.focus();
                    }
                }

                // Home/End support for quick navigation
                if (e.key === 'Home') {
                    e.preventDefault();
                    items[0]?.focus();
                }

                if (e.key === 'End') {
                    e.preventDefault();
                    items[items.length - 1]?.focus();
                }

                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                    if (!isMulti) {
                        trigger.focus();
                    }
                }

                if (e.key === 'Escape') {
                    closeDropdown(dropdown);
                    trigger.focus();
                }
            });
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });

    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown.open').forEach(d => {
            closeDropdown(d);
        });
    }

    function closeDropdown(dropdown) {
        dropdown.classList.remove('open');
        const trigger = dropdown.querySelector('.dropdown__trigger');
        const menu = dropdown.querySelector('.dropdown__menu');
        const arrow = dropdown.querySelector('.dropdown__arrow');

        trigger?.setAttribute('aria-expanded', 'false');
        menu?.classList.add('opacity-0', 'invisible', '-translate-y-2');
        menu?.classList.remove('opacity-100', 'visible', 'translate-y-0');
        arrow?.classList.remove('rotate-180');
    }
});


// Add .is-scrolling class when user scrolls with mouse wheel
const scrollContainers = document.querySelectorAll('.custom-scrollbar');

scrollContainers.forEach(container => {
    let scrollTimeout;
    container.addEventListener('scroll', () => {
        container.classList.add('is-scrolling');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            container.classList.remove('is-scrolling');
        }, 1000);
    });
});

/**
 * Hyperlinks Demo Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const hyperlinksDemo = document.querySelector('#hyperlinks .hyperlinks-demo');
    const resetHyperlinksStateButton = document.getElementById('reset-hyperlinks-state');
    const demoLinks = hyperlinksDemo ? hyperlinksDemo.querySelectorAll('[data-demo-link]') : [];
    const demoNavigationLinks = hyperlinksDemo ? hyperlinksDemo.querySelectorAll('.link-navigation:not(.is-disabled)') : [];
    const globalNavigationLinks = document.querySelectorAll('.link-navigation:not(.is-disabled)');

    const bindNavigationLinkBehavior = (links) => {
        links.forEach((link) => {
            if (link.dataset.navigationBound === 'true') return;
            link.dataset.navigationBound = 'true';

            link.addEventListener('click', (event) => {
                const href = (link.getAttribute('href') || '').trim();
                if (!href.startsWith('#')) return;

                event.preventDefault();
                const isActive = link.classList.toggle('is-active');
                if (isActive) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        });
    };

    demoLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            link.classList.add('is-visited');
        });
    });

    bindNavigationLinkBehavior(demoNavigationLinks);
    bindNavigationLinkBehavior(globalNavigationLinks);

    if (resetHyperlinksStateButton) {
        resetHyperlinksStateButton.addEventListener('click', () => {
            demoLinks.forEach((link) => {
                link.classList.remove('is-visited');
                link.blur();
            });
            demoNavigationLinks.forEach((link) => {
                link.classList.remove('is-active');
                link.removeAttribute('aria-current');
                link.blur();
            });
        });
    }
});

/**
 * File Uploader Component Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // Setup for Folder Upload
    setupDropZone('folderDropZone', 'folderInput');

    // Setup for File Upload
    setupDropZone('fileDropZone', 'fileInput');

    // Setup for Image Upload
    setupDropZone('imageDropZone', 'imageInput');
});

function setupDropZone(dropZoneId, inputId) {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(inputId);

    if (!dropZone || !fileInput) return;

    // Trigger input on click
    dropZone.addEventListener('click', () => fileInput.click());

    // Handle drag enter and drag over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('!border-green-secondary', '!bg-green-secondary/10');
        });
    });

    // Handle drag leave and drop
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('!border-green-secondary', '!bg-green-secondary/10');
        });
    });

    // Handle drop event
    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // You can manually set the files to the input if needed
            // Note: Setting files programmatically has limitations in some browsers
            handleFiles(files, dropZone);
        }
    });

    // Handle file selection via input
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFiles(fileInput.files, dropZone);
        }
    });

    // Hover effect for icon
    dropZone.addEventListener('mouseenter', () => {
        const icon = dropZone.querySelector('.drop-zone__icon');
        if (icon) {
            icon.style.transform = 'translateY(-5px)';
        }
    });

    dropZone.addEventListener('mouseleave', () => {
        const icon = dropZone.querySelector('.drop-zone__icon');
        if (icon) {
            icon.style.transform = 'translateY(0)';
        }
    });
}

function handleFiles(files, dropZone) {
    const text = dropZone.querySelector('.drop-zone__text');
    const container = dropZone.parentElement;
    const label = container ? container.querySelector('label') : null;

    if (label) {
        label.classList.remove('text-grey-primary');
        label.classList.add('text-black');
    }

    if (text) {
        const count = files.length;
        const itemWord = count === 1 ? 'item' : 'items';
        text.textContent = `${count} ${itemWord} ready to upload`;
        text.classList.remove('text-black', 'text-green-secondary');
        text.classList.add('text-green-primary', 'group-hover:text-green-secondary');
    }

    console.log('Files selected:', files);
    // Here you would typically handle the file upload to your server
}


/**
 * Language Selector Logic
 */

function toggleLangMenu(button) {
    const container = button.closest('.language-selector-root');
    const menu = container.querySelector('.dropdown__menu');
    const arrow = button.querySelector('.arrow-icon');

    // Check current state (menu hidden via 'invisible')
    const isClosed = menu.classList.contains('invisible');

    // Close all other menus first
    closeAllLangMenus();

    if (isClosed) {
        // Open: remove hidden classes used by dropdown component and add visible ones
        menu.classList.remove('opacity-0', 'invisible', '-translate-y-2');
        menu.classList.add('opacity-100', 'visible', 'translate-y-0');
        if (arrow) {
            arrow.classList.add('rotate-180', 'text-green-secondary');
            arrow.classList.remove('text-grey-primary');
        }
        button.setAttribute('aria-expanded', 'true');
    }
}

function selectLang(option, langName, countryCode) {
    // 1. Find the Container
    const container = option.closest('.language-selector-root');
    const button = container.querySelector('button');

    // 2. Update Label (if exists)
    const label = button.querySelector('.current-lang-text');
    if (label) {
        label.textContent = langName;
    }

    // 3. Update Flag (if exists)
    const flagParams = {
        'gb': { src: 'https://flagcdn.com/w40/gb.png', srcset: 'https://flagcdn.com/w80/gb.png 2x', alt: 'English' },
        'pt': { src: 'https://flagcdn.com/w40/pt.png', srcset: 'https://flagcdn.com/w80/pt.png 2x', alt: 'Português' },
        'es': { src: 'https://flagcdn.com/w40/es.png', srcset: 'https://flagcdn.com/w80/es.png 2x', alt: 'Español' },
        'fr': { src: 'https://flagcdn.com/w40/fr.png', srcset: 'https://flagcdn.com/w80/fr.png 2x', alt: 'Français' },
    };

    if (countryCode && flagParams[countryCode]) {
        const flagImg = button.querySelector('.current-lang-flag');
        if (flagImg) {
            flagImg.src = flagParams[countryCode].src;
            flagImg.srcset = flagParams[countryCode].srcset;
            flagImg.alt = flagParams[countryCode].alt;
        }
    }

    // 4. Handle Checks (Visual Selection)
    // partial reset for this menu only
    const allChecks = container.querySelectorAll('.check-icon');
    allChecks.forEach(icon => {
        icon.classList.remove('opacity-100');
        icon.classList.add('opacity-0');
    });

    // set active
    const thisCheck = option.querySelector('.check-icon');
    if (thisCheck) {
        thisCheck.classList.remove('opacity-0');
        thisCheck.classList.add('opacity-100');
    }

    // 5. Close Menu
    closeAllLangMenus();
}

function closeAllLangMenus() {
    document.querySelectorAll('.language-selector-root').forEach(container => {
        const menu = container.querySelector('.dropdown__menu');
        const arrow = container.querySelector('.arrow-icon');
        const button = container.querySelector('button');

        if (menu) {
            menu.classList.add('opacity-0', 'invisible', '-translate-y-2');
            menu.classList.remove('opacity-100', 'visible', 'translate-y-0');
        }
        if (arrow) {
            arrow.classList.remove('rotate-180', 'text-green-secondary');
            arrow.classList.add('text-grey-primary');
        }
        if (button) {
            button.setAttribute('aria-expanded', 'false');
        }
    });
}

// Close ALL menus when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.closest('.language-selector-root')) {
        closeAllLangMenus();
    }
});


/**
 * Material Selector Logic
 * Handles single-selection material buttons
 */

function selectMaterial(element) {
    // 1. Remove selection from all siblings
    const parent = element.parentElement;
    const items = parent.querySelectorAll('.material-item');

    items.forEach(item => {
        item.classList.remove('is-selected');

        // restore label styles
        const label = item.querySelector('.material-label');
        if (label) {
            label.classList.remove('text-green-secondary', 'font-bold');
            label.classList.add('text-grey-primary');
        }

        // hide check if present
        const check = item.querySelector('.label-check');
        if (check) {
            check.classList.remove('opacity-100', 'scale-100');
            check.classList.add('opacity-0', 'scale-75');
        }

        // reset thumb styles
        const thumb = item.querySelector('.material-thumb');
        if (thumb) {
            thumb.classList.remove('shadow-btn-glow', '-translate-y-lift');
            thumb.classList.add('shadow-btn-default');
            const img = thumb.querySelector('.material-img');
            if (img) img.classList.remove('scale-110');
        }
    });

    // 2. Add selection to clicked element
    element.classList.add('is-selected');

    // update label
    const label = element.querySelector('.material-label');
    if (label) {
        label.classList.remove('text-grey-primary');
        label.classList.add('text-green-secondary', 'font-bold');
    }

    // show check icon if present
    const check = element.querySelector('.label-check');
    if (check) {
        check.classList.remove('opacity-0', 'scale-75');
        check.classList.add('opacity-100', 'scale-100');
    }

    // uplift thumb and add glow
    const thumb = element.querySelector('.material-thumb');
    if (thumb) {
        thumb.classList.remove('shadow-btn-default');
        thumb.classList.add('shadow-btn-glow', '-translate-y-lift');
        const img = thumb.querySelector('.material-img');
        if (img) img.classList.add('scale-110');
    }

    // Log selection
    const materialName = label ? label.textContent : 'Unknown';
    console.log('Selected material:', materialName);
}

// Set first item as selected by default
document.addEventListener('DOMContentLoaded', () => {
    const firstItem = document.querySelector('.material-item');
    if (firstItem) {
        selectMaterial(firstItem);
    }
});


/**
 * Stepper Component Logic
 */

let maxUnlockedStep = 1;

function setActiveStep(stepNumber) {
    const allItems = document.querySelectorAll('#stepper [data-stepper-item]');

    if (!allItems.length) {
        return;
    }

    const totalSteps = allItems.length;
    const requestedStep = Math.min(Math.max(Number(stepNumber) || 1, 1), totalSteps);

    maxUnlockedStep = Math.max(maxUnlockedStep, requestedStep);

    allItems.forEach((item) => {
        const itemStep = Number(item.dataset.step) || 1;
        const isActive = itemStep === requestedStep;
        const isLocked = itemStep > maxUnlockedStep;
        const button = item.querySelector('[data-stepper-button]');

        item.classList.remove('is-default', 'is-active', 'is-locked');

        if (isActive) {
            item.classList.add('is-active');
        } else if (isLocked) {
            item.classList.add('is-locked');
        } else {
            item.classList.add('is-default');
        }

        if (button) {
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');

            if (isActive) {
                button.setAttribute('aria-current', 'step');
            } else {
                button.removeAttribute('aria-current');
            }
        }
    });
}

// Initialize default active step on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setActiveStep(1));
} else {
    setActiveStep(1);
}


/**
 * Quantity Selector Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    const wrappers = document.querySelectorAll('#quantity-selector .quantity-selector');

    wrappers.forEach(wrapper => {
        const input = wrapper.querySelector('.quantity-selector-value');
        const decreaseBtn = wrapper.querySelector('button[aria-label="Decrease quantity"]');
        const increaseBtn = wrapper.querySelector('button[aria-label="Increase quantity"]');

        if (!input || !decreaseBtn || !increaseBtn) {
            return;
        }

        // Settings
        const min = parseInt(wrapper.dataset.min) || 0;
        const max = parseInt(wrapper.dataset.max) || 999;
        let lastValidValue = min;

        commitTypedValue();

        // Event Listeners
        decreaseBtn.addEventListener('click', () => {
            commitTypedValue();

            let currentValue = parseInt(input.value, 10);
            if (currentValue > min) {
                updateValue(currentValue - 1);
            }
        });

        increaseBtn.addEventListener('click', () => {
            commitTypedValue();

            let currentValue = parseInt(input.value, 10);
            if (currentValue < max) {
                updateValue(currentValue + 1);
            }
        });

        input.addEventListener('blur', () => {
            commitTypedValue();
        });

        input.addEventListener('change', () => {
            commitTypedValue();
        });

        // Helper to update value and UI state
        function updateValue(newValue) {
            setCommittedValue(newValue, true);
        }

        function commitTypedValue() {
            const rawValue = input.value.trim();
            let nextValue;

            if (rawValue === '') {
                nextValue = lastValidValue;
            } else {
                const parsedValue = parseInt(rawValue, 10);
                nextValue = Number.isNaN(parsedValue) ? lastValidValue : parsedValue;
            }

            if (nextValue < min) {
                nextValue = min;
            }

            if (nextValue > max) {
                nextValue = max;
            }

            setCommittedValue(nextValue, false);
        }

        function setCommittedValue(newValue, dispatchChange) {
            input.value = newValue;
            lastValidValue = newValue;
            updateState();

            if (dispatchChange) {
                input.dispatchEvent(new Event('change'));
            }
        }

        // Helper to disable buttons at limits
        function updateState() {
            let currentValue = parseInt(input.value, 10);

            if (Number.isNaN(currentValue)) {
                currentValue = lastValidValue;
                input.value = currentValue;
            }

            // Check limits
            if (currentValue <= min) {
                decreaseBtn.disabled = true;
                input.value = min; // Enforce min
                lastValidValue = min;
            } else {
                decreaseBtn.disabled = false;
            }

            if (currentValue >= max) {
                increaseBtn.disabled = true;
                input.value = max; // Enforce max
                lastValidValue = max;
            } else {
                increaseBtn.disabled = false;
            }
        }
    });

});


// Toggle password visibility (uses atom ghost icon button)
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'ri-eye-off-line text-icon-sm';
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('aria-label', 'Hide password');
    } else {
        input.type = 'password';
        icon.className = 'ri-eye-line text-icon-sm';
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', 'Show password');
    }
}

// Toggle Short Bio expansion
function toggleBioExpand() {
    const ta = document.getElementById('bioInput');
    const btn = document.getElementById('bioExpandBtn');
    const icon = btn.querySelector('i');
    const expanded = btn.getAttribute('aria-expanded') === 'true';

    if (!expanded) {
        ta.rows = 8;
        btn.setAttribute('aria-expanded', 'true');
        icon.classList.add('rotate-45');
        icon.classList.add('text-green-secondary');
    } else {
        ta.rows = 3;
        btn.setAttribute('aria-expanded', 'false');
        icon.classList.remove('rotate-45');
        icon.classList.remove('text-green-secondary');
    }
}

// Update character count
function updateCharCount(textarea) {
    const count = textarea.value.length;
    const max = textarea.maxLength;
    document.getElementById('charCount').textContent = `${count}/${max}`;
}


/**
 * Modal Component Scripts
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Open Modal Logic
    const openTriggers = document.querySelectorAll('[data-modal-target]');

    openTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                openModal(modal);
            }
        });
    });

    // 2. Close Modal Logic
    const closeButtons = document.querySelectorAll('[data-close-modal], .modal-close');

    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modalOverlay = button.closest('.modal-overlay');
            closeModal(modalOverlay);
        });
    });

    // Close on Backdrop Click
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal-overlay.is-visible');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });

    // --- Functions ---

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');

        // Disable page scroll
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');

        // Re-enable page scroll
        document.body.style.overflow = '';
    }
});
