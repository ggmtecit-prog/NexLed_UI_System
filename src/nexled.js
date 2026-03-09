/**
 * Accordion Component Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const accordionTriggers = document.querySelectorAll('#accordion .accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') {
                return;
            }

            const item = trigger.closest('.accordion-item');
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            trigger.setAttribute('aria-expanded', String(!isExpanded));
            item?.classList.toggle('is-open', !isExpanded);

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
    const dropdownSection = document.getElementById('dropdown');

    if (!dropdownSection) {
        return;
    }

    const dropdowns = Array.from(dropdownSection.querySelectorAll('.dropdown'));
    const enabledDropdowns = dropdowns.filter(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        return trigger && !trigger.disabled && trigger.getAttribute('aria-disabled') !== 'true';
    });

    enabledDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const items = Array.from(dropdown.querySelectorAll('.dropdown-item'));
        const valueDisplay = dropdown.querySelector('.dropdown-value');
        const isMulti = dropdown.classList.contains('dropdown-multi');

        items.forEach(item => {
            item.setAttribute('tabindex', '-1');

            item.addEventListener('focus', () => {
                item.scrollIntoView({ block: 'nearest' });
            });
        });

        if (isMulti) {
            bindMultiDropdown(dropdown, trigger, items, valueDisplay);
            updateMultiValue(dropdown, valueDisplay);
        } else {
            bindSingleDropdown(dropdown, trigger, items, valueDisplay);
            const selectedItem = items.find(item => item.getAttribute('aria-selected') === 'true');
            if (selectedItem) {
                updateValue(dropdown, valueDisplay, getItemLabel(selectedItem));
            }
        }

        bindTriggerKeyboard(dropdown, trigger, items);
        bindItemKeyboard(dropdown, trigger, items, isMulti);

        trigger.addEventListener('click', () => {
            if (dropdown.classList.contains('is-open')) {
                closeDropdown(dropdown);
                return;
            }

            openDropdown(dropdown);
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('#dropdown .dropdown')) {
            closeAllDropdowns();
        }
    });

    function bindSingleDropdown(dropdown, trigger, items, valueDisplay) {
        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(option => {
                    option.setAttribute('aria-selected', 'false');
                });

                item.setAttribute('aria-selected', 'true');
                updateValue(dropdown, valueDisplay, getItemLabel(item));
                closeDropdown(dropdown);
                trigger.focus();
            });
        });
    }

    function bindMultiDropdown(dropdown, trigger, items, valueDisplay) {
        items.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');

            if (!checkbox) {
                return;
            }

            checkbox.tabIndex = -1;
            item.setAttribute('aria-selected', String(checkbox.checked));

            checkbox.addEventListener('click', event => {
                event.stopPropagation();
            });

            checkbox.addEventListener('change', () => {
                syncMultiItem(item, checkbox.checked);
                updateMultiValue(dropdown, valueDisplay);
            });

            item.addEventListener('click', event => {
                if (event.target.closest('.checkbox-wrapper')) {
                    return;
                }

                event.preventDefault();
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });
    }

    function bindTriggerKeyboard(dropdown, trigger, items) {
        trigger.addEventListener('keydown', event => {
            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (!dropdown.classList.contains('is-open')) {
                    openDropdown(dropdown);
                }
                items[0]?.focus();
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (!dropdown.classList.contains('is-open')) {
                    openDropdown(dropdown);
                }
                items[items.length - 1]?.focus();
            }

            if (event.key === 'Escape') {
                closeDropdown(dropdown);
            }
        });
    }

    function bindItemKeyboard(dropdown, trigger, items, isMulti) {
        items.forEach((item, index) => {
            item.addEventListener('keydown', event => {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    items[(index + 1) % items.length]?.focus();
                }

                if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    items[(index - 1 + items.length) % items.length]?.focus();
                }

                if (event.key === 'Home') {
                    event.preventDefault();
                    items[0]?.focus();
                }

                if (event.key === 'End') {
                    event.preventDefault();
                    items[items.length - 1]?.focus();
                }

                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    if (isMulti) {
                        const checkbox = item.querySelector('input[type="checkbox"]');
                        if (checkbox) {
                            checkbox.checked = !checkbox.checked;
                            syncMultiItem(item, checkbox.checked);
                            updateMultiValue(dropdown, dropdown.querySelector('.dropdown-value'));
                        }
                        return;
                    }

                    item.click();
                }

                if (event.key === 'Escape') {
                    closeDropdown(dropdown);
                    trigger.focus();
                }
            });
        });
    }

    function getItemLabel(item) {
        return item.textContent.replace(/\s+/g, ' ').trim();
    }

    function updateValue(dropdown, valueDisplay, value) {
        if (!valueDisplay) {
            return;
        }

        valueDisplay.textContent = value;
        dropdown.classList.add('has-value');
    }

    function updateMultiValue(dropdown, valueDisplay) {
        if (!valueDisplay) {
            return;
        }

        const selectedItems = Array.from(dropdown.querySelectorAll('.dropdown-item[aria-selected="true"]'));

        if (selectedItems.length === 0) {
            valueDisplay.textContent = 'Select options';
            dropdown.classList.remove('has-value');
            return;
        }

        if (selectedItems.length === 1) {
            updateValue(dropdown, valueDisplay, getItemLabel(selectedItems[0]));
            return;
        }

        updateValue(dropdown, valueDisplay, `${selectedItems.length} selected`);
    }

    function syncMultiItem(item, isSelected) {
        item.setAttribute('aria-selected', String(isSelected));
    }

    function openDropdown(dropdown) {
        closeAllDropdowns(dropdown);
        dropdown.classList.add('is-open');
        dropdown.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'true');
    }

    function closeAllDropdowns(exceptDropdown = null) {
        dropdowns.forEach(dropdown => {
            if (dropdown !== exceptDropdown) {
                closeDropdown(dropdown);
            }
        });
    }

    function closeDropdown(dropdown) {
        dropdown.classList.remove('is-open');
        dropdown.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
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
    initUploaders();
});

function initUploaders() {
    const uploaders = document.querySelectorAll('#file-uploader [data-uploader]');
    uploaders.forEach((uploader) => {
        setupUploader(uploader);
    });
}

function setupUploader(uploader) {
    const dropZone = uploader.querySelector('[data-uploader-zone]');
    const fileInput = uploader.querySelector('[data-uploader-input]');

    if (!dropZone || !fileInput) return;

    let dragDepth = 0;

    const openFilePicker = () => {
        fileInput.click();
    };

    dropZone.addEventListener('click', () => {
        openFilePicker();
    });

    dropZone.addEventListener('keydown', (event) => {
        const isEnter = event.key === 'Enter';
        const isSpace = event.key === ' ' || event.key === 'Spacebar';

        if (!isEnter && !isSpace) return;

        event.preventDefault();
        openFilePicker();
    });

    dropZone.addEventListener('dragenter', (event) => {
        event.preventDefault();
        dragDepth += 1;
        uploader.classList.add('is-dragover');
    });

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        uploader.classList.add('is-dragover');
    });

    dropZone.addEventListener('dragleave', (event) => {
        event.preventDefault();
        dragDepth = Math.max(0, dragDepth - 1);

        if (dragDepth === 0) {
            uploader.classList.remove('is-dragover');
        }
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dragDepth = 0;
        uploader.classList.remove('is-dragover');

        const files = event.dataTransfer ? event.dataTransfer.files : null;
        handleUploaderFiles(files || [], uploader);
    });

    fileInput.addEventListener('change', () => {
        handleUploaderFiles(fileInput.files, uploader);
    });

    handleUploaderFiles(fileInput.files, uploader);
}

function handleUploaderFiles(files, uploader) {
    const text = uploader.querySelector('[data-uploader-text]');

    if (!text) return;

    const idleText = text.dataset.uploaderIdleText || text.textContent.trim();
    const fileCount = files ? files.length : 0;

    uploader.classList.remove('is-dragover');

    if (fileCount > 0) {
        const itemWord = fileCount === 1 ? 'item' : 'items';
        uploader.classList.remove('is-default');
        uploader.classList.add('has-files');
        text.textContent = `${fileCount} ${itemWord} ready to upload`;
        console.log('Files selected:', files);
        return;
    }

    uploader.classList.remove('has-files');
    uploader.classList.add('is-default');
    text.textContent = idleText;
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
    const list = element.closest('.material-selector-list');

    if (!list) {
        return;
    }

    const items = list.querySelectorAll('.material-item');

    items.forEach(item => {
        item.classList.remove('is-selected');
        item.setAttribute('aria-selected', 'false');
    });

    element.classList.add('is-selected');
    element.setAttribute('aria-selected', 'true');

    const label = element.querySelector('.material-label');
    const materialName = label ? label.textContent : 'Unknown';
    console.log('Selected material:', materialName);
}


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

function initializeStepper() {
    const stepperRoot = document.querySelector('#stepper .stepper');

    setActiveStep(1);

    if (!stepperRoot || stepperRoot.dataset.stepperClickBound === 'true') {
        return;
    }

    stepperRoot.dataset.stepperClickBound = 'true';
    stepperRoot.addEventListener('click', (event) => {
        if (event.target.closest('[data-stepper-button]')) {
            return;
        }

        const stepItem = event.target.closest('[data-stepper-item]');

        if (!stepItem || !stepperRoot.contains(stepItem)) {
            return;
        }

        setActiveStep(Number(stepItem.dataset.step) || 1);
    });
}

// Initialize default active step on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStepper);
} else {
    initializeStepper();
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
