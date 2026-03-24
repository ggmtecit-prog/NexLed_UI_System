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
    bar.style.transform = "translateY(var(--space-12))";
    bar.style.marginBottom = `-${bar.offsetHeight}px`;

    // Remove from DOM after animation (400ms match)
    setTimeout(() => {
        bar.style.display = 'none';
    }, 400);
}


/* ============================================================
   Dropdown Menu Component Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = Array.from(document.querySelectorAll('.dropdown'));

    if (dropdowns.length === 0) {
        return;
    }
    const enabledDropdowns = dropdowns.filter(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        return trigger && !trigger.disabled && trigger.getAttribute('aria-disabled') !== 'true';
    });

    // Hover-trigger dropdowns (data-dropdown-trigger="hover")
    // Add data-dropdown-trigger="hover" to a .dropdown wrapper to open on mouseenter/mouseleave.
    // To switch to click: remove the attribute. To switch to JS hover: add it back.
    dropdowns
        .filter(d => d.dataset.dropdownTrigger === 'hover')
        .forEach(dropdown => {
            const idx = enabledDropdowns.indexOf(dropdown);
            if (idx !== -1) enabledDropdowns.splice(idx, 1);
            let closeTimer;
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(closeTimer);
                openDropdown(dropdown);
            });
            dropdown.addEventListener('mouseleave', () => {
                closeTimer = setTimeout(() => closeDropdown(dropdown), 150);
            });
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
        if (!event.target.closest('.dropdown')) {
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
    const text = uploader.querySelector('[data-uploader-text]');
    const note = uploader.querySelector('.uploader-note');

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

    if (uploader.classList.contains('is-error') && text) {
        setUploaderErrorState(
            uploader,
            text,
            note,
            fileInput,
            text.textContent.trim(),
            note ? note.textContent.trim() : ''
        );
        return;
    }

    handleUploaderFiles(fileInput.files, uploader);
}

function isPdfFile(file) {
    if (!file) return false;
    const name = (file.name || '').toLowerCase();
    const type = (file.type || '').toLowerCase();
    return type === 'application/pdf' || name.endsWith('.pdf');
}

function getUploaderMaxBytes(uploader) {
    const rawMaxSizeMb = uploader.dataset.uploaderMaxSizeMb;
    const maxSizeMb = Number(rawMaxSizeMb);

    if (!Number.isFinite(maxSizeMb) || maxSizeMb <= 0) {
        return null;
    }

    return maxSizeMb * 1024 * 1024;
}

function formatUploaderMaxSize(maxBytes) {
    const maxSizeMb = maxBytes / (1024 * 1024);
    return Number.isInteger(maxSizeMb) ? `${maxSizeMb} MB` : `${maxSizeMb.toFixed(1)} MB`;
}

function setUploaderIcon(uploader, iconClass) {
    const icon = uploader.querySelector('.uploader-icon i');
    if (!icon) return;

    if (!icon.dataset.uploaderIdleIcon) {
        icon.dataset.uploaderIdleIcon = icon.className;
    }

    icon.className = iconClass;
}

function resetUploaderIcon(uploader) {
    const icon = uploader.querySelector('.uploader-icon i');
    if (!icon) return;

    if (!icon.dataset.uploaderIdleIcon) {
        icon.dataset.uploaderIdleIcon = icon.className;
    }

    icon.className = icon.dataset.uploaderIdleIcon;
}

function setUploaderErrorState(uploader, text, note, fileInput, errorText, errorNote) {
    uploader.classList.remove('has-files');
    uploader.classList.remove('is-default');
    uploader.classList.add('is-error');
    setUploaderIcon(uploader, 'ri-close-line');
    text.textContent = errorText;

    if (note) {
        note.textContent = errorNote;
    }

    if (fileInput) {
        fileInput.setAttribute('aria-invalid', 'true');
        fileInput.value = '';
    }
}

function handleUploaderFiles(files, uploader) {
    const text = uploader.querySelector('[data-uploader-text]');
    const note = uploader.querySelector('.uploader-note');
    const fileInput = uploader.querySelector('[data-uploader-input]');

    if (!text) return;

    const idleText = text.dataset.uploaderIdleText || text.textContent.trim();
    const idleNote = note ? (note.dataset.uploaderIdleNote || note.textContent.trim()) : '';

    if (note && !note.dataset.uploaderIdleNote) {
        note.dataset.uploaderIdleNote = idleNote;
    }

    const fileCount = files ? files.length : 0;
    const maxBytes = getUploaderMaxBytes(uploader);

    uploader.classList.remove('is-dragover');

    if (fileCount > 0) {
        const selectedFiles = Array.from(files);
        const isPdfOnly = uploader.classList.contains('uploader-file');
        const hasInvalidFileType = isPdfOnly && selectedFiles.some((file) => !isPdfFile(file));
        const hasOversizedFile = maxBytes !== null && selectedFiles.some((file) => file.size > maxBytes);

        if (hasInvalidFileType || hasOversizedFile) {
            const maxSizeLabel = maxBytes === null ? '' : formatUploaderMaxSize(maxBytes);
            let errorText = 'Please upload a valid file.';
            let errorNote = idleNote;

            if (hasInvalidFileType && hasOversizedFile) {
                errorText = `Only PDF files up to ${maxSizeLabel} are allowed.`;
                errorNote = `Please upload PDF files that are ${maxSizeLabel} or smaller.`;
            } else if (hasInvalidFileType) {
                errorText = 'Only PDF files are allowed.';
                errorNote = 'Please upload a PDF file.';
            } else if (hasOversizedFile) {
                errorText = `Files must be ${maxSizeLabel} or smaller.`;
                errorNote = `Please upload files that are ${maxSizeLabel} or smaller.`;
            }

            setUploaderErrorState(uploader, text, note, fileInput, errorText, errorNote);
            return;
        }

        uploader.classList.remove('is-error');
        resetUploaderIcon(uploader);

        if (fileInput) {
            fileInput.removeAttribute('aria-invalid');
        }

        if (note && note.dataset.uploaderIdleNote) {
            note.textContent = note.dataset.uploaderIdleNote;
        }

        const itemWord = fileCount === 1 ? 'item' : 'items';
        uploader.classList.remove('is-default');
        uploader.classList.add('has-files');
        text.textContent = `${fileCount} ${itemWord} ready to upload`;
        console.log('Files selected:', files);
        return;
    }

    uploader.classList.remove('has-files');
    uploader.classList.remove('is-error');
    uploader.classList.add('is-default');
    resetUploaderIcon(uploader);
    text.textContent = idleText;

    if (note && note.dataset.uploaderIdleNote) {
        note.textContent = note.dataset.uploaderIdleNote;
    }

    if (fileInput) {
        fileInput.removeAttribute('aria-invalid');
    }
}
/**
 * Language Selector Logic
 */


/* Legacy language-selector hooks removed. */
/* legacy payload retained only as commented history
        'pt': { src: 'https://flagcdn.com/w40/pt.png', srcset: 'https://flagcdn.com/w80/pt.png 2x', alt: 'Portuguese' },
        'es': { src: 'https://flagcdn.com/w40/es.png', srcset: 'https://flagcdn.com/w80/es.png 2x', alt: 'Spanish' },
        'fr': { src: 'https://flagcdn.com/w40/fr.png', srcset: 'https://flagcdn.com/w80/fr.png 2x', alt: 'French' },
    };

}

function legacyLanguageSelectorCloseShim() {
    return;
*/

document.addEventListener('DOMContentLoaded', () => {
    const languageMetadata = {
        gb: { label: 'English' },
        pt: { label: 'Portugu\u00EAs' },
        es: { label: 'Espa\u00F1ol' },
    };

    const selectors = Array.from(document.querySelectorAll('.language-selector'));

    if (selectors.length === 0) {
        return;
    }
    const enabledSelectors = selectors.filter(selector => {
        const trigger = selector.querySelector('.language-selector-trigger');
        return trigger && !trigger.disabled && trigger.getAttribute('aria-disabled') !== 'true';
    });

    enabledSelectors.forEach(selector => {
        const trigger = selector.querySelector('.language-selector-trigger');
        const options = Array.from(selector.querySelectorAll('.language-selector-option'));
        const valueDisplay = selector.querySelector('.language-selector-value');

        options.forEach(option => {
            option.setAttribute('tabindex', '-1');

            option.addEventListener('focus', () => {
                option.scrollIntoView({ block: 'nearest' });
            });

            option.addEventListener('click', () => {
                syncLanguageSelection(selector, option, valueDisplay, languageMetadata);
                closeLanguageSelector(selector);
                trigger.focus();
            });
        });

        initializeLanguageSelector(selector, options, valueDisplay, languageMetadata);
        bindLanguageTriggerKeyboard(selector, trigger, options);
        bindLanguageOptionKeyboard(selector, trigger, options, valueDisplay, languageMetadata);

        trigger.addEventListener('click', () => {
            if (selector.classList.contains('is-open')) {
                closeLanguageSelector(selector);
                return;
            }

            openLanguageSelector(selector);
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.language-selector')) {
            closeAllLanguageSelectors();
        }
    });

    function initializeLanguageSelector(selector, options, valueDisplay, metadata) {
        const selectedOption = options.find(option => option.getAttribute('aria-selected') === 'true')
            || options.find(option => option.dataset.code === 'gb')
            || options[0];

        if (!selectedOption) {
            return;
        }

        syncLanguageSelection(selector, selectedOption, valueDisplay, metadata);
    }

    function bindLanguageTriggerKeyboard(selector, trigger, options) {
        trigger.addEventListener('keydown', event => {
            const selectedOption = getSelectedLanguageOption(options);

            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                if (!selector.classList.contains('is-open')) {
                    openLanguageSelector(selector);
                }
                (selectedOption || options[0])?.focus();
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (!selector.classList.contains('is-open')) {
                    openLanguageSelector(selector);
                }
                (selectedOption || options[options.length - 1])?.focus();
            }

            if (event.key === 'Escape') {
                closeLanguageSelector(selector);
            }
        });
    }

    function bindLanguageOptionKeyboard(selector, trigger, options, valueDisplay, metadata) {
        options.forEach((option, index) => {
            option.addEventListener('keydown', event => {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    options[(index + 1) % options.length]?.focus();
                }

                if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    options[(index - 1 + options.length) % options.length]?.focus();
                }

                if (event.key === 'Home') {
                    event.preventDefault();
                    options[0]?.focus();
                }

                if (event.key === 'End') {
                    event.preventDefault();
                    options[options.length - 1]?.focus();
                }

                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    syncLanguageSelection(selector, option, valueDisplay, metadata);
                    closeLanguageSelector(selector);
                    trigger.focus();
                }

                if (event.key === 'Escape') {
                    closeLanguageSelector(selector);
                    trigger.focus();
                }
            });
        });
    }

    function getSelectedLanguageOption(options) {
        return options.find(option => option.getAttribute('aria-selected') === 'true');
    }

    function syncLanguageSelection(selector, selectedOption, valueDisplay, metadata) {
        const options = Array.from(selector.querySelectorAll('.language-selector-option'));

        options.forEach(option => {
            option.setAttribute('aria-selected', String(option === selectedOption));
        });

        const code = (selectedOption.dataset.code || 'gb').toLowerCase();
        const language = metadata[code] || { label: getLanguageOptionLabel(selectedOption) };
        updateLanguageSelectorTrigger(selector, code, language.label, valueDisplay);
        selector.classList.add('has-value');
    }

    function updateLanguageSelectorTrigger(selector, code, label, valueDisplay) {
        const trigger = selector.querySelector('.language-selector-trigger');
        const triggerFlag = selector.querySelector('.language-selector-current .language-selector-flag');

        if (trigger) {
            trigger.setAttribute('aria-label', `Current language: ${label}`);
        }

        if (triggerFlag) {
            triggerFlag.src = getLanguageFlagSrc(code);
            triggerFlag.srcset = getLanguageFlagSrcSet(code);
            triggerFlag.alt = '';
        }

        if (valueDisplay) {
            valueDisplay.textContent = label;
        }
    }

    function getLanguageOptionLabel(option) {
        return option.querySelector('span')?.textContent.replace(/\s+/g, ' ').trim() || '';
    }

    function getLanguageFlagSrc(code) {
        return `https://flagcdn.com/w40/${code}.png`;
    }

    function getLanguageFlagSrcSet(code) {
        return `https://flagcdn.com/w80/${code}.png 2x`;
    }

    function openLanguageSelector(selector) {
        closeAllLanguageSelectors(selector);
        selector.classList.add('is-open');
        selector.querySelector('.language-selector-trigger')?.setAttribute('aria-expanded', 'true');
    }

    function closeAllLanguageSelectors(exceptSelector = null) {
        selectors.forEach(selector => {
            if (selector !== exceptSelector) {
                closeLanguageSelector(selector);
            }
        });
    }

    function closeLanguageSelector(selector) {
        selector.classList.remove('is-open');
        selector.querySelector('.language-selector-trigger')?.setAttribute('aria-expanded', 'false');
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


function isLettersAndSpaces(value) {
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
        return false;
    }

    return /^[\p{L}\p{M}]+(?:\s+[\p{L}\p{M}]+)*$/u.test(trimmedValue);
}

function applyInputValidationState(input, hint, isValid) {
    if (!input || !hint) {
        return;
    }

    const validMessage = input.dataset.validMessage || 'Looks great!';
    const invalidMessage = input.dataset.invalidMessage || 'Please provide a valid entry.';

    input.classList.toggle('input-success', isValid);
    input.classList.toggle('input-error', !isValid);
    input.setAttribute('aria-invalid', isValid ? 'false' : 'true');

    hint.classList.toggle('input-success', isValid);
    hint.classList.toggle('input-error', !isValid);

    hint.textContent = isValid ? validMessage : invalidMessage;
}

function initializeTextFieldDemo() {
    const section = document.getElementById('text-field');

    if (!section || section.dataset.textFieldInitialized === 'true') {
        return;
    }

    section.dataset.textFieldInitialized = 'true';

    const passwordInput = section.querySelector('#passwordInput');
    const passwordToggle = section.querySelector('#passwordToggle');

    if (passwordInput && passwordToggle) {
        passwordToggle.addEventListener('click', () => {
            const icon = passwordToggle.querySelector('i');
            const isPassword = passwordInput.type === 'password';

            passwordInput.type = isPassword ? 'text' : 'password';
            passwordToggle.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
            passwordToggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

            if (icon) {
                icon.className = isPassword ? 'ri-eye-off-line text-icon-sm' : 'ri-eye-line text-icon-sm';
                icon.setAttribute('aria-hidden', 'true');
            }
        });
    }

    const passwordHintId = passwordInput ? passwordInput.getAttribute('aria-describedby') : null;
    const passwordHint = passwordHintId ? document.getElementById(passwordHintId) : null;

    if (passwordInput && passwordHint) {
        const syncPasswordValidationState = () => {
            applyInputValidationState(passwordInput, passwordHint, isLettersAndSpaces(passwordInput.value));
        };

        syncPasswordValidationState();
        passwordInput.addEventListener('input', syncPasswordValidationState);
        passwordInput.addEventListener('blur', syncPasswordValidationState);
    }

    const bioInput = section.querySelector('#bioInput');
    const bioExpandBtn = section.querySelector('#bioExpandBtn');
    const charCount = section.querySelector('#charCount');

    if (bioInput && charCount) {
        const syncCharCount = () => {
            charCount.textContent = `${bioInput.value.length}/${bioInput.maxLength}`;
        };

        syncCharCount();
        bioInput.addEventListener('input', syncCharCount);
    }

    if (bioInput && bioExpandBtn) {
        bioExpandBtn.addEventListener('click', () => {
            const icon = bioExpandBtn.querySelector('i');
            const expanded = bioExpandBtn.getAttribute('aria-expanded') === 'true';

            bioInput.rows = expanded ? 3 : 8;
            bioExpandBtn.setAttribute('aria-expanded', expanded ? 'false' : 'true');

            if (icon) {
                icon.classList.toggle('rotate-45', !expanded);
                icon.classList.toggle('text-green-secondary', !expanded);
            }
        });
    }

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTextFieldDemo);
} else {
    initializeTextFieldDemo();
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
            const openModal = document.querySelector('.modal-overlay.is-open, .modal-overlay.is-visible');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });

    // --- Functions ---

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('is-open');
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'false');

        // Disable page scroll
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('is-open');
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');

        // Re-enable page scroll
        document.body.style.overflow = '';
    }
});


/**
 * Carousel Component Logic
 * Handles slide transitions, dot/arrow navigation, and keyboard support.
 */

document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        if (!track) return;

        const slides = Array.from(track.querySelectorAll('.carousel-slide'));
        const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');

        if (slides.length === 0) return;

        let currentIndex = slides.findIndex(slide => slide.classList.contains('is-active'));
        if (currentIndex === -1) currentIndex = 0;

        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            slides.forEach((slide, i) => {
                const isTarget = i === index;
                slide.classList.toggle('is-active', isTarget);
            });

            dots.forEach((dot, i) => {
                const isTarget = i === index;
                dot.classList.toggle('is-active', isTarget);

                if (isTarget) {
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.removeAttribute('aria-current');
                }
            });

            currentIndex = index;
        }

        // Arrow navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Keyboard navigation
        carousel.setAttribute('tabindex', '0');
        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-roledescription', 'carousel');

        carousel.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goToSlide(currentIndex - 1);
            }

            if (event.key === 'ArrowRight') {
                event.preventDefault();
                goToSlide(currentIndex + 1);
            }
        });

        // Ensure initial state is correct
        goToSlide(currentIndex);
    });
});


/* ============================================================
   Flyout Products Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-flyout-products]').forEach(flyout => {
        const tabs = Array.from(flyout.querySelectorAll('[data-flyout-category]'));
        const panels = Array.from(flyout.querySelectorAll('[data-flyout-panel]'));
        if (tabs.length === 0 || panels.length === 0) return;

        const activateCategory = category => {
            tabs.forEach(tab => {
                const isActive = tab.dataset.flyoutCategory === category;
                tab.classList.toggle('is-active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
                tab.setAttribute('tabindex', isActive ? '0' : '-1');
            });

            panels.forEach(panel => {
                panel.hidden = panel.dataset.flyoutPanel !== category;
            });
        };

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                activateCategory(tab.dataset.flyoutCategory);
            });

            tab.addEventListener('keydown', event => {
                let nextIndex = index;

                if (event.key === 'ArrowDown') {
                    nextIndex = (index + 1) % tabs.length;
                } else if (event.key === 'ArrowUp') {
                    nextIndex = (index - 1 + tabs.length) % tabs.length;
                } else if (event.key === 'Home') {
                    nextIndex = 0;
                } else if (event.key === 'End') {
                    nextIndex = tabs.length - 1;
                } else {
                    return;
                }

                event.preventDefault();
                const nextTab = tabs[nextIndex];
                activateCategory(nextTab.dataset.flyoutCategory);
                nextTab.focus();
            });
        });

        const initialCategory =
            tabs.find(tab => tab.classList.contains('is-active'))?.dataset.flyoutCategory ||
            tabs[0].dataset.flyoutCategory;

        activateCategory(initialCategory);
    });
});
/* ============================================================
   Tabs Component Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab-bar[data-tabs]').forEach(tabBar => {
        let tabCounter = tabBar.querySelectorAll('.tab-item').length;

        // Activate tab on click (skip if close button is the target)
        tabBar.addEventListener('click', e => {
            if (e.target.closest('.tab-close')) return;
            const item = e.target.closest('.tab-item');
            if (!item) return;

            tabBar.querySelectorAll('.tab-item').forEach(t => t.classList.remove('is-active'));
            item.classList.add('is-active');
        });

        // Close tab on close button click
        tabBar.addEventListener('click', e => {
            const closeBtn = e.target.closest('.tab-close');
            if (!closeBtn) return;

            const item = closeBtn.closest('.tab-item');
            const wasActive = item.classList.contains('is-active');
            const allItems = [...tabBar.querySelectorAll('.tab-item')];
            const idx = allItems.indexOf(item);

            item.remove();

            // If removed tab was active, activate the nearest remaining tab
            if (wasActive) {
                const remaining = [...tabBar.querySelectorAll('.tab-item')];
                if (remaining.length > 0) {
                    remaining[Math.min(idx, remaining.length - 1)].classList.add('is-active');
                }
            }
        });

        // Add new tab on + click
        const addWrapper = tabBar.querySelector('.tab-add');
        if (addWrapper) {
            addWrapper.querySelector('button').addEventListener('click', () => {
                tabCounter++;
                const label = `Form ${tabCounter}`;
                const tab = document.createElement('div');
                tab.className = 'tab-item';
                tab.setAttribute('role', 'tab');
                tab.setAttribute('tabindex', '0');
                tab.innerHTML = `
                    <span class="tab-label">${label}</span>
                    <button type="button" class="tab-close" aria-label="Close ${label}">
                        <i class="ri-close-line" aria-hidden="true"></i>
                    </button>
                `;
                tabBar.insertBefore(tab, addWrapper);
            });
        }
    });
});



/**
 * Pagination Component Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-pagination]').forEach(pagination => {
        if (pagination.dataset.paginationBound === 'true') {
            return;
        }

        pagination.dataset.paginationBound = 'true';

        const pageButtons = Array.from(pagination.querySelectorAll('[data-page]'));
        const prevBtn = pagination.querySelector('[data-pagination-prev]');
        const nextBtn = pagination.querySelector('[data-pagination-next]');

        if (pageButtons.length === 0) {
            return;
        }

        const getActiveIndex = () => {
            const activeIndex = pageButtons.findIndex(button => button.getAttribute('aria-current') === 'page');
            return activeIndex === -1 ? 0 : activeIndex;
        };

        const syncState = nextIndex => {
            const safeIndex = Math.min(Math.max(nextIndex, 0), pageButtons.length - 1);

            pageButtons.forEach((button, index) => {
                if (index === safeIndex) {
                    button.setAttribute('aria-current', 'page');
                } else {
                    button.removeAttribute('aria-current');
                }
            });

            if (prevBtn) {
                prevBtn.disabled = safeIndex === 0;
                prevBtn.setAttribute('aria-disabled', safeIndex === 0 ? 'true' : 'false');
            }

            if (nextBtn) {
                nextBtn.disabled = safeIndex === pageButtons.length - 1;
                nextBtn.setAttribute('aria-disabled', safeIndex === pageButtons.length - 1 ? 'true' : 'false');
            }
        };

        pageButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                syncState(index);
            });
        });

        prevBtn?.addEventListener('click', () => {
            syncState(getActiveIndex() - 1);
        });

        nextBtn?.addEventListener('click', () => {
            syncState(getActiveIndex() + 1);
        });

        syncState(getActiveIndex());
    });
});

/**
 * Date Picker Component Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const datePickers = Array.from(document.querySelectorAll('[data-date-picker]'));

    if (datePickers.length === 0) {
        return;
    }

    const locale = document.documentElement.lang || navigator.language || 'en-US';
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
    const inputFormatter = new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short', year: 'numeric' });
    const summaryFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
    const ariaFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const weekdayLabels = createWeekdayLabels(locale);
    let openPicker = null;

    datePickers.forEach((picker, index) => {
        const input = picker.querySelector('[data-date-picker-input]');
        const valueField = picker.querySelector('[data-date-picker-value]');
        const trigger = picker.querySelector('[data-date-picker-trigger]');
        const panel = picker.querySelector('[data-date-picker-panel]');
        const monthLabel = picker.querySelector('[data-date-picker-month]');
        const weekdayRow = picker.querySelector('[data-date-picker-weekdays]');
        const daysGrid = picker.querySelector('[data-date-picker-days]');
        const summary = picker.querySelector('[data-date-picker-summary]');
        const prevButton = picker.querySelector('[data-date-picker-prev]');
        const nextButton = picker.querySelector('[data-date-picker-next]');
        const todayButton = picker.querySelector('[data-date-picker-today]');

        if (!input || !valueField || !trigger || !panel || !monthLabel || !weekdayRow || !daysGrid || !summary || !prevButton || !nextButton || !todayButton) {
            return;
        }

        const defaultDate = parseISODate(picker.dataset.datePickerDefault);
        const viewDate = defaultDate || stripTime(new Date());
        const panelIdBase = input.id || 'datePicker' + String(index + 1);
        panel.id = panel.id || `${panelIdBase}-panel`;

        picker._datePickerState = {
            selectedDate: defaultDate,
            viewYear: viewDate.getFullYear(),
            viewMonth: viewDate.getMonth(),
        };

        trigger.setAttribute('aria-controls', panel.id);
        trigger.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-controls', panel.id);
        input.setAttribute('aria-expanded', 'false');

        renderWeekdays(weekdayRow);
        renderDatePicker(picker);

        if (picker.dataset.datePickerOpen === 'true') {
            openDatePicker(picker, false);
        }

        trigger.addEventListener('click', () => {
            if (picker.classList.contains('is-open')) {
                closeDatePicker(picker, true);
                return;
            }

            openDatePicker(picker, true);
        });

        input.addEventListener('click', () => openDatePicker(picker, true));
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
                event.preventDefault();
                openDatePicker(picker, true);
            }

            if (event.key === 'Escape') {
                closeDatePicker(picker, false);
            }
        });

        prevButton.addEventListener('click', () => {
            shiftViewMonth(picker, -1);
        });

        nextButton.addEventListener('click', () => {
            shiftViewMonth(picker, 1);
        });

        todayButton.addEventListener('click', () => {
            selectDate(picker, stripTime(new Date()), true);
        });

        daysGrid.addEventListener('click', event => {
            const dayButton = event.target.closest('[data-date-picker-day]');
            if (!dayButton) {
                return;
            }

            const selectedDate = parseISODate(dayButton.dataset.datePickerDay);
            if (!selectedDate) {
                return;
            }

            selectDate(picker, selectedDate, true);
        });

        daysGrid.addEventListener('keydown', event => {
            const currentButton = event.target.closest('[data-date-picker-day]');
            if (!currentButton) {
                return;
            }

            const buttons = Array.from(daysGrid.querySelectorAll('[data-date-picker-day]'));
            const currentIndex = buttons.indexOf(currentButton);
            let nextIndex = currentIndex;

            switch (event.key) {
                case 'ArrowRight':
                    nextIndex = currentIndex + 1;
                    break;
                case 'ArrowLeft':
                    nextIndex = currentIndex - 1;
                    break;
                case 'ArrowDown':
                    nextIndex = currentIndex + 7;
                    break;
                case 'ArrowUp':
                    nextIndex = currentIndex - 7;
                    break;
                case 'Home':
                    nextIndex = currentIndex - (currentIndex % 7);
                    break;
                case 'End':
                    nextIndex = currentIndex + (6 - (currentIndex % 7));
                    break;
                default:
                    return;
            }

            if (nextIndex < 0 || nextIndex >= buttons.length) {
                return;
            }

            event.preventDefault();
            buttons[nextIndex].focus();
        });
    });

    document.addEventListener('click', event => {
        datePickers.forEach(picker => {
            if (picker.contains(event.target)) {
                return;
            }

            closeDatePicker(picker, false);
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !openPicker) {
            return;
        }

        closeDatePicker(openPicker, true);
    });

    function renderWeekdays(weekdayRow) {
        const labels = weekdayLabels.map(label => {
            const element = document.createElement('span');
            element.textContent = label;
            return element;
        });

        weekdayRow.replaceChildren(...labels);
    }

    function renderDatePicker(picker) {
        const state = picker._datePickerState;
        const input = picker.querySelector('[data-date-picker-input]');
        const valueField = picker.querySelector('[data-date-picker-value]');
        const monthLabel = picker.querySelector('[data-date-picker-month]');
        const daysGrid = picker.querySelector('[data-date-picker-days]');
        const summary = picker.querySelector('[data-date-picker-summary]');
        const visibleMonth = new Date(state.viewYear, state.viewMonth, 1);
        const today = stripTime(new Date());

        monthLabel.textContent = monthFormatter.format(visibleMonth);
        input.value = state.selectedDate ? inputFormatter.format(state.selectedDate) : '';
        valueField.value = state.selectedDate ? toISODate(state.selectedDate) : '';
        summary.textContent = state.selectedDate ? summaryFormatter.format(state.selectedDate) : 'No date selected';

        const firstVisibleDay = new Date(state.viewYear, state.viewMonth, 1);
        const offset = (firstVisibleDay.getDay() + 6) % 7;
        firstVisibleDay.setDate(firstVisibleDay.getDate() - offset);

        const buttons = [];

        for (let index = 0; index < 42; index += 1) {
            const dayDate = new Date(firstVisibleDay);
            dayDate.setDate(firstVisibleDay.getDate() + index);

            const dayButton = document.createElement('button');
            const classNames = ['date-picker-day'];

            dayButton.type = 'button';
            dayButton.dataset.datePickerDay = toISODate(dayDate);
            dayButton.textContent = String(dayDate.getDate());
            dayButton.setAttribute('aria-label', ariaFormatter.format(dayDate));
            dayButton.setAttribute('aria-pressed', state.selectedDate && isSameDay(dayDate, state.selectedDate) ? 'true' : 'false');

            if (dayDate.getMonth() !== state.viewMonth) {
                classNames.push('is-outside');
            }

            if (isSameDay(dayDate, today)) {
                classNames.push('is-today');
                dayButton.setAttribute('aria-current', 'date');
            }

            if (state.selectedDate && isSameDay(dayDate, state.selectedDate)) {
                classNames.push('is-selected');
            }

            dayButton.className = classNames.join(' ');
            buttons.push(dayButton);
        }

        daysGrid.replaceChildren(...buttons);
    }

    function openDatePicker(picker, focusSelectedDay) {
        datePickers.forEach(otherPicker => {
            if (otherPicker !== picker) {
                closeDatePicker(otherPicker, false);
            }
        });

        const panel = picker.querySelector('[data-date-picker-panel]');
        if (!panel) {
            return;
        }

        picker.classList.add('is-open');
        panel.hidden = false;
        setExpandedState(picker, true);
        openPicker = picker;

        if (focusSelectedDay) {
            requestAnimationFrame(() => {
                focusPreferredDay(picker);
            });
        }
    }

    function closeDatePicker(picker, restoreFocus) {
        const panel = picker.querySelector('[data-date-picker-panel]');
        if (!panel) {
            return;
        }

        picker.classList.remove('is-open');
        panel.hidden = true;
        setExpandedState(picker, false);

        if (openPicker === picker) {
            openPicker = null;
        }

        if (restoreFocus) {
            picker.querySelector('[data-date-picker-trigger]')?.focus();
        }
    }

    function setExpandedState(picker, isOpen) {
        const trigger = picker.querySelector('[data-date-picker-trigger]');
        const input = picker.querySelector('[data-date-picker-input]');
        const value = isOpen ? 'true' : 'false';

        trigger?.setAttribute('aria-expanded', value);
        input?.setAttribute('aria-expanded', value);
    }

    function shiftViewMonth(picker, direction) {
        const state = picker._datePickerState;
        const nextDate = new Date(state.viewYear, state.viewMonth + direction, 1);

        state.viewYear = nextDate.getFullYear();
        state.viewMonth = nextDate.getMonth();
        renderDatePicker(picker);

        requestAnimationFrame(() => {
            focusPreferredDay(picker);
        });
    }

    function selectDate(picker, date, closeAfterSelect) {
        const normalizedDate = stripTime(date);
        const state = picker._datePickerState;

        state.selectedDate = normalizedDate;
        state.viewYear = normalizedDate.getFullYear();
        state.viewMonth = normalizedDate.getMonth();
        renderDatePicker(picker);

        if (closeAfterSelect) {
            closeDatePicker(picker, true);
        }
    }

    function focusPreferredDay(picker) {
        const daysGrid = picker.querySelector('[data-date-picker-days]');
        if (!daysGrid) {
            return;
        }

        const preferredButton =
            daysGrid.querySelector('.is-selected') ||
            daysGrid.querySelector('.is-today:not(.is-outside)') ||
            daysGrid.querySelector('[data-date-picker-day]');

        preferredButton?.focus();
    }

    function createWeekdayLabels(localeValue) {
        const formatter = new Intl.DateTimeFormat(localeValue, { weekday: 'short' });
        const mondayStart = new Date(2024, 0, 1);

        return Array.from({ length: 7 }, (_, index) => {
            const weekday = new Date(mondayStart);
            weekday.setDate(mondayStart.getDate() + index);
            return formatter.format(weekday).replace('.', '');
        });
    }

    function parseISODate(value) {
        if (!value) {
            return null;
        }

        const parts = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!parts) {
            return null;
        }

        const parsedDate = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
        return Number.isNaN(parsedDate.getTime()) ? null : stripTime(parsedDate);
    }

    function stripTime(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function toISODate(date) {
        const year = String(date.getFullYear());
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    function isSameDay(firstDate, secondDate) {
        return firstDate.getFullYear() === secondDate.getFullYear()
            && firstDate.getMonth() === secondDate.getMonth()
            && firstDate.getDate() === secondDate.getDate();
    }
});
/**
 * Search Overlay Component Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const triggers = Array.from(document.querySelectorAll('[data-search-overlay-target]'));
    const overlays = Array.from(document.querySelectorAll('.search-overlay[data-search-overlay-modal="true"]'));

    if (triggers.length === 0 || overlays.length === 0) {
        return;
    }

    triggers.forEach(trigger => {
        const targetId = trigger.dataset.searchOverlayTarget;
        if (!targetId) {
            return;
        }

        trigger.setAttribute('aria-controls', targetId);
        trigger.setAttribute('aria-expanded', 'false');

        trigger.addEventListener('click', () => {
            const overlay = overlays.find(item => item.id === targetId);
            if (!overlay) {
                return;
            }

            openSearchOverlay(overlay, trigger);
        });
    });

    overlays.forEach(overlay => {
        overlay.querySelectorAll('[data-search-overlay-close]').forEach(button => {
            button.addEventListener('click', () => {
                closeSearchOverlay(overlay, true);
            });
        });

        overlay.addEventListener('click', event => {
            if (event.target === overlay) {
                closeSearchOverlay(overlay, true);
            }
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') {
            return;
        }

        const openOverlay = overlays.find(overlay => overlay.classList.contains('is-open'));
        if (!openOverlay) {
            return;
        }

        closeSearchOverlay(openOverlay, true);
    });

    function syncTriggerState(targetId, isOpen) {
        triggers
            .filter(trigger => trigger.dataset.searchOverlayTarget === targetId)
            .forEach(trigger => {
                trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
    }

    function syncBodyLock() {
        document.body.classList.toggle('search-overlay-open', overlays.some(overlay => overlay.classList.contains('is-open')));
    }

    function openSearchOverlay(overlay, trigger) {
        const targetId = overlay.id;

        overlays.forEach(otherOverlay => {
            if (otherOverlay !== overlay) {
                closeSearchOverlay(otherOverlay, false);
            }
        });

        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        overlay._lastTrigger = trigger;
        syncTriggerState(targetId, true);
        syncBodyLock();

        requestAnimationFrame(() => {
            overlay.querySelector('[data-search-overlay-input]')?.focus();
        });
    }

    function closeSearchOverlay(overlay, restoreFocus) {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        syncTriggerState(overlay.id, false);
        syncBodyLock();

        if (restoreFocus && overlay._lastTrigger) {
            overlay._lastTrigger.focus();
        }
    }
});
/**
 * Toast Component Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const triggers = Array.from(document.querySelectorAll('[data-toast-target]'));
    const toasts = Array.from(document.querySelectorAll('.toast'));
    const dismissDelay = 4000;
    const hideDelay = 400;
    const toastTimers = new Map();

    if (triggers.length === 0 || toasts.length === 0) {
        return;
    }

    toasts.forEach(toast => {
        toast.hidden = true;
    });

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const toast = document.getElementById(trigger.dataset.toastTarget || '');
            if (!toast) {
                return;
            }

            showToast(toast);
        });
    });

    document.querySelectorAll('[data-toast-close]').forEach(button => {
        button.addEventListener('click', () => {
            const toast = button.closest('.toast');
            if (!toast) {
                return;
            }

            hideToast(toast);
        });
    });

    function showToast(toast) {
        clearToastTimers(toast);
        toast.hidden = false;
        toast.setAttribute('aria-hidden', 'false');

        requestAnimationFrame(() => {
            toast.classList.add('is-visible');
        });

        const dismissTimer = setTimeout(() => {
            hideToast(toast);
        }, dismissDelay);

        toastTimers.set(toast, { dismissTimer, hideTimer: null });
    }

    function hideToast(toast) {
        clearToastTimers(toast);
        toast.classList.remove('is-visible');
        toast.setAttribute('aria-hidden', 'true');

        const hideTimer = setTimeout(() => {
            toast.hidden = true;
            toastTimers.delete(toast);
        }, hideDelay);

        toastTimers.set(toast, { dismissTimer: null, hideTimer });
    }

    function clearToastTimers(toast) {
        const timers = toastTimers.get(toast);
        if (!timers) {
            return;
        }

        if (timers.dismissTimer) {
            clearTimeout(timers.dismissTimer);
        }

        if (timers.hideTimer) {
            clearTimeout(timers.hideTimer);
        }
    }
});



