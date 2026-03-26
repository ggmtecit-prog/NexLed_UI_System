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

function dismissSurfaceById(id) {
    const surface = document.getElementById(id);
    if (!surface || surface.hidden) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof surface.animate !== 'function') {
        surface.hidden = true;
        return;
    }

    const styles = getComputedStyle(surface);
    const duration = Number.parseFloat(styles.getPropertyValue('--motion-duration-default')) || 400;
    const easing = styles.getPropertyValue('--motion-ease-premium').trim() || 'cubic-bezier(0.16, 1, 0.3, 1)';
    const offset = styles.getPropertyValue('--space-12').trim() || '12px';

    surface.setAttribute('aria-hidden', 'true');

    const animation = surface.animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: `translateY(${offset})` }
    ], {
        duration,
        easing,
        fill: 'forwards'
    });

    animation.addEventListener('finish', () => {
        surface.hidden = true;
    }, { once: true });
}

function closeBar(id) {
    dismissSurfaceById(id);
}

function closeAlert(id) {
    dismissSurfaceById(id);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('input[type="checkbox"][data-state="indeterminate"]').forEach(checkbox => {
        checkbox.indeterminate = true;
        syncIndeterminateCheckbox(checkbox);

        checkbox.addEventListener('change', () => {
            syncIndeterminateCheckbox(checkbox);
        });
    });
});

function syncIndeterminateCheckbox(checkbox) {
    if (checkbox.indeterminate) {
        checkbox.setAttribute('aria-checked', 'mixed');
        return;
    }

    checkbox.removeAttribute('aria-checked');
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
        return trigger && !trigger.disabled && trigger.getAttribute('aria-disabled') !== 'true' && selector.getAttribute('aria-disabled') !== 'true';
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


/**
 * Custom Scrollbar Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const rootScrollTargets = [document.documentElement, document.body].filter(Boolean);
    const scrollContainerSelectors = [
        '.custom-scrollbar',
        '.dropdown-menu',
        '.language-selector-menu',
        '.combobox-list',
        '.data-table-wrap',
        '.drawer-sheet-body',
        '.segmented-control',
        '.tab-bar',
        '.pagination-list'
    ];

    const scrollContainers = Array.from(document.querySelectorAll(scrollContainerSelectors.join(', ')))
        .filter((container, index, collection) => collection.indexOf(container) === index)
        .filter(container => container !== document.documentElement && container !== document.body);

    let rootScrollTimeout;
    const setRootScrolling = () => {
        rootScrollTargets.forEach(target => {
            target.classList.add('is-scrolling-root');
        });

        clearTimeout(rootScrollTimeout);
        rootScrollTimeout = setTimeout(() => {
            rootScrollTargets.forEach(target => {
                target.classList.remove('is-scrolling-root');
            });
        }, 900);
    };

    window.addEventListener('scroll', setRootScrolling, { passive: true });

    scrollContainers.forEach(container => {
        container.classList.add('custom-scrollbar');

        if (container.dataset.scrollbarBound === 'true') {
            return;
        }

        container.dataset.scrollbarBound = 'true';

        let scrollTimeout;
        container.addEventListener('scroll', () => {
            container.classList.add('is-scrolling');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                container.classList.remove('is-scrolling');
            }, 900);
        });
    });
});
/**
 * Hyperlinks Demo Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const hyperlinksDemo = document.querySelector('#hyperlinks .hyperlinks-demo');
    const resetHyperlinksStateButton = document.getElementById('reset-hyperlinks-state');
    const demoLinks = hyperlinksDemo ? hyperlinksDemo.querySelectorAll('[data-demo-link]') : [];
    const demoNavigationLinks = hyperlinksDemo ? hyperlinksDemo.querySelectorAll('.link-navigation:not(.is-disabled):not([aria-disabled="true"])') : [];
    const globalNavigationLinks = document.querySelectorAll('.link-navigation:not(.is-disabled):not([aria-disabled="true"])');

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
    const uploaders = document.querySelectorAll('[data-uploader]');
    uploaders.forEach((uploader) => {
        setupUploader(uploader);
    });
}

function syncUploaderDisabledState(uploader, dropZone, fileInput) {
    const isDisabled = uploader.getAttribute('aria-disabled') === 'true' || (fileInput && fileInput.disabled);

    if (!dropZone) {
        return isDisabled;
    }

    if (isDisabled) {
        dropZone.setAttribute('aria-disabled', 'true');
        dropZone.setAttribute('tabindex', '-1');
        return true;
    }

    dropZone.removeAttribute('aria-disabled');

    if (!dropZone.hasAttribute('tabindex') || dropZone.getAttribute('tabindex') === '-1') {
        dropZone.setAttribute('tabindex', '0');
    }

    return false;
}

function setupUploader(uploader) {
    const dropZone = uploader.querySelector('[data-uploader-zone]');
    const fileInput = uploader.querySelector('[data-uploader-input]');
    const text = uploader.querySelector('[data-uploader-text]');
    const note = uploader.querySelector('.uploader-note');

    if (!dropZone || !fileInput) return;

    if (syncUploaderDisabledState(uploader, dropZone, fileInput)) {
        uploader.classList.remove('is-dragover');
        return;
    }

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
        return trigger && !trigger.disabled && trigger.getAttribute('aria-disabled') !== 'true' && selector.getAttribute('aria-disabled') !== 'true';
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

function getEnabledMaterialItems(list) {
    return Array.from(list.querySelectorAll('.material-item')).filter(item => {
        return !item.disabled && item.getAttribute('aria-disabled') !== 'true';
    });
}

function syncMaterialSelectorState(list) {
    const items = Array.from(list.querySelectorAll('.material-item'));

    if (!items.length) {
        return;
    }

    const enabledItems = getEnabledMaterialItems(list);
    const selectedItem = items.find(item => {
        return item.classList.contains('is-selected') || item.getAttribute('aria-selected') === 'true';
    }) || null;
    const focusItem = enabledItems.find(item => item === selectedItem) || enabledItems[0] || null;

    items.forEach(item => {
        const isSelected = item === selectedItem;
        item.classList.toggle('is-selected', isSelected);
        item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        item.tabIndex = item === focusItem ? 0 : -1;
    });
}

function selectMaterial(element, options = {}) {
    const list = element.closest('.material-selector-list');

    if (!list || element.disabled || element.getAttribute('aria-disabled') === 'true') {
        return;
    }

    const items = list.querySelectorAll('.material-item');

    items.forEach(item => {
        item.classList.remove('is-selected');
        item.setAttribute('aria-selected', 'false');
        item.tabIndex = -1;
    });

    element.classList.add('is-selected');
    element.setAttribute('aria-selected', 'true');
    element.tabIndex = 0;

    if (options.focus) {
        element.focus();
    }
}

function initializeMaterialSelectors() {
    const materialLists = document.querySelectorAll('.material-selector-list');

    materialLists.forEach(list => {
        syncMaterialSelectorState(list);

        list.addEventListener('click', event => {
            const item = event.target.closest('.material-item');

            if (!item || !list.contains(item)) {
                return;
            }

            selectMaterial(item);
        });

        list.addEventListener('keydown', event => {
            const currentItem = event.target.closest('.material-item');

            if (!currentItem || !list.contains(currentItem)) {
                return;
            }

            const enabledItems = getEnabledMaterialItems(list);

            if (!enabledItems.length) {
                return;
            }

            const currentIndex = enabledItems.indexOf(currentItem);
            let nextIndex = currentIndex;

            switch (event.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % enabledItems.length;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    nextIndex = currentIndex === -1 ? enabledItems.length - 1 : (currentIndex - 1 + enabledItems.length) % enabledItems.length;
                    break;
                case 'Home':
                    nextIndex = 0;
                    break;
                case 'End':
                    nextIndex = enabledItems.length - 1;
                    break;
                default:
                    return;
            }

            event.preventDefault();
            selectMaterial(enabledItems[nextIndex], { focus: true });
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeMaterialSelectors);

/**
 * Stepper Component Logic
 */

function getStepperItems(stepperRoot) {
    return Array.from(stepperRoot.querySelectorAll('[data-stepper-item]'));
}

function getInitialActiveStep(stepperRoot) {
    const items = getStepperItems(stepperRoot);
    const activeItem = items.find(item => item.classList.contains('is-active'))
        || items.find(item => item.querySelector('[data-stepper-button][aria-pressed="true"]'))
        || items[0];

    return Number(activeItem?.dataset.step) || 1;
}

function getInitialUnlockedStep(stepperRoot) {
    const unlockedSteps = getStepperItems(stepperRoot)
        .filter(item => !item.classList.contains('is-locked'))
        .map(item => Number(item.dataset.step) || 1);

    return unlockedSteps.length ? Math.max(...unlockedSteps) : getInitialActiveStep(stepperRoot);
}

function setActiveStep(stepNumber, stepperRoot = null) {
    const targetRoot = stepperRoot || document.querySelector('.stepper');

    if (!targetRoot) {
        return;
    }

    const allItems = getStepperItems(targetRoot);

    if (!allItems.length) {
        return;
    }

    const totalSteps = allItems.length;
    const requestedStep = Math.min(Math.max(Number(stepNumber) || 1, 1), totalSteps);
    const currentMaxUnlocked = Number(targetRoot.dataset.stepperMaxUnlocked) || 1;
    const maxUnlockedStep = Math.max(currentMaxUnlocked, requestedStep);

    targetRoot.dataset.stepperMaxUnlocked = String(maxUnlockedStep);

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

function initializeSteppers() {
    const stepperRoots = Array.from(document.querySelectorAll('.stepper')).filter(stepperRoot => {
        return stepperRoot.querySelector('[data-stepper-item]');
    });

    stepperRoots.forEach((stepperRoot) => {
        const initialActiveStep = getInitialActiveStep(stepperRoot);
        const initialUnlockedStep = Math.max(getInitialUnlockedStep(stepperRoot), initialActiveStep);

        stepperRoot.dataset.stepperMaxUnlocked = String(initialUnlockedStep);
        setActiveStep(initialActiveStep, stepperRoot);

        if (stepperRoot.dataset.stepperClickBound === 'true') {
            return;
        }

        stepperRoot.dataset.stepperClickBound = 'true';
        stepperRoot.addEventListener('click', (event) => {
            const stepItem = event.target.closest('[data-stepper-item]');

            if (!stepItem || !stepperRoot.contains(stepItem)) {
                return;
            }

            setActiveStep(Number(stepItem.dataset.step) || 1, stepperRoot);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSteppers);
} else {
    initializeSteppers();
}

/**
 * Quantity Selector Logic
 */

function initializeQuantitySelectors() {
    const wrappers = document.querySelectorAll('.quantity-selector');

    wrappers.forEach(wrapper => {
        const input = wrapper.querySelector('.quantity-selector-value');
        const buttons = wrapper.querySelectorAll('button');
        const decreaseBtn = buttons[0];
        const increaseBtn = buttons[buttons.length - 1];

        if (!input || buttons.length < 2 || !decreaseBtn || !increaseBtn) {
            return;
        }

        const min = parseInt(wrapper.dataset.min || input.min || '0', 10);
        const max = parseInt(wrapper.dataset.max || input.max || '999', 10);
        const resolvedMin = Number.isNaN(min) ? 0 : min;
        const resolvedMax = Number.isNaN(max) ? 999 : max;
        const isLocked = wrapper.getAttribute('aria-disabled') === 'true' || input.disabled;
        let lastValidValue = resolvedMin;

        input.min = String(resolvedMin);
        input.max = String(resolvedMax);
        input.step = '1';

        const initialValue = parseInt(input.value, 10);
        const safeInitialValue = Number.isNaN(initialValue)
            ? resolvedMin
            : Math.min(resolvedMax, Math.max(resolvedMin, initialValue));

        input.value = safeInitialValue;
        lastValidValue = safeInitialValue;
        updateState();

        if (isLocked) {
            return;
        }

        decreaseBtn.addEventListener('click', () => {
            commitTypedValue();

            const currentValue = parseInt(input.value, 10);
            if (currentValue > resolvedMin) {
                updateValue(currentValue - 1);
            }
        });

        increaseBtn.addEventListener('click', () => {
            commitTypedValue();

            const currentValue = parseInt(input.value, 10);
            if (currentValue < resolvedMax) {
                updateValue(currentValue + 1);
            }
        });

        input.addEventListener('blur', () => {
            commitTypedValue();
        });

        input.addEventListener('change', () => {
            commitTypedValue();
        });

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

            if (nextValue < resolvedMin) {
                nextValue = resolvedMin;
            }

            if (nextValue > resolvedMax) {
                nextValue = resolvedMax;
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

        function updateState() {
            let currentValue = parseInt(input.value, 10);

            if (Number.isNaN(currentValue)) {
                currentValue = lastValidValue;
                input.value = currentValue;
            }

            if (isLocked) {
                decreaseBtn.disabled = true;
                increaseBtn.disabled = true;
                return;
            }

            if (currentValue <= resolvedMin) {
                decreaseBtn.disabled = true;
                input.value = resolvedMin;
                lastValidValue = resolvedMin;
            } else {
                decreaseBtn.disabled = false;
            }

            if (currentValue >= resolvedMax) {
                increaseBtn.disabled = true;
                input.value = resolvedMax;
                lastValidValue = resolvedMax;
            } else {
                increaseBtn.disabled = false;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeQuantitySelectors);

function isLettersAndSpaces(value) {
    const trimmedValue = value.trim();

    if (trimmedValue === '') {
        return false;
    }

    return /^[\p{L}\p{M}]+(?:\s+[\p{L}\p{M}]+)*$/u.test(trimmedValue);
}

function isMinLength(value, minimumLength) {
    return value.trim().length >= minimumLength;
}

function isValidTextFieldValue(input) {
    if (!input) {
        return false;
    }

    const validationRule = input.dataset.textValidation || 'non-empty';

    if (validationRule === 'letters-spaces') {
        return isLettersAndSpaces(input.value);
    }

    if (validationRule === 'min-length') {
        return isMinLength(input.value, Number(input.dataset.minLength || 1));
    }

    return input.value.trim() !== '';
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
                icon.className = isPassword ? 'ri-eye-off-line text-icon-xs' : 'ri-eye-line text-icon-xs';
                icon.setAttribute('aria-hidden', 'true');
            }
        });
    }

    const bioInput = section.querySelector('#bioInput');
    const charCount = section.querySelector('#charCount');

    if (bioInput && charCount) {
        const syncCharCount = () => {
            charCount.textContent = `${bioInput.value.length}/${bioInput.maxLength}`;
        };

        syncCharCount();
        bioInput.addEventListener('input', syncCharCount);
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

                if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                    nextIndex = (index + 1) % tabs.length;
                } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
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
        if (tabBar.dataset.tabsBound === 'true') {
            return;
        }

        tabBar.dataset.tabsBound = 'true';
        let tabCounter = tabBar.querySelectorAll('.tab-item').length;
        let isMouseDown = false;
        let pointerStartX = 0;
        let startScrollLeft = 0;
        let isDraggingTabs = false;
        let suppressTabClick = false;

        const dragThreshold = 6;
        const getTabs = () => Array.from(tabBar.querySelectorAll('.tab-item'));
        const canDragTabs = () => tabBar.scrollWidth > tabBar.clientWidth;

        const finishTabDrag = () => {
            tabBar.removeAttribute('data-dragging-tabs');
            isMouseDown = false;
            pointerStartX = 0;
            startScrollLeft = 0;
            isDraggingTabs = false;
        };

        const centerTabInView = (tab, behavior = 'smooth') => {
            if (!tab) {
                return;
            }

            const motionBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? 'auto'
                : behavior;

            if (typeof tab.scrollIntoView === 'function') {
                tab.scrollIntoView({
                    behavior: motionBehavior,
                    block: 'nearest',
                    inline: 'center'
                });
                return;
            }

            const maxScrollLeft = tabBar.scrollWidth - tabBar.clientWidth;
            if (maxScrollLeft <= 0) {
                return;
            }

            const nextScrollLeft = Math.min(
                Math.max(tab.offsetLeft - ((tabBar.clientWidth - tab.offsetWidth) / 2), 0),
                maxScrollLeft
            );

            tabBar.scrollTo({
                left: nextScrollLeft,
                behavior: motionBehavior
            });
        };

        const syncTabs = preferredActiveTab => {
            const tabs = getTabs();
            if (tabs.length === 0) {
                return null;
            }

            const activeTab = preferredActiveTab && tabs.includes(preferredActiveTab)
                ? preferredActiveTab
                : tabs.find(tab => tab.classList.contains('is-active')) || tabs[0];

            tabs.forEach(tab => {
                const isActive = tab === activeTab;
                tab.classList.toggle('is-active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
                tab.setAttribute('tabindex', isActive ? '0' : '-1');
            });

            return activeTab;
        };

        const activateTab = (tab, options = {}) => {
            const activeTab = syncTabs(tab);

            if (options.focus && activeTab) {
                try {
                    activeTab.focus({ preventScroll: true });
                } catch (error) {
                    activeTab.focus();
                }
            }

            window.requestAnimationFrame(() => {
                centerTabInView(activeTab, options.behavior || 'smooth');
            });
        };

        tabBar.addEventListener('mousedown', event => {
            if (event.button !== 0 || !canDragTabs()) {
                return;
            }

            if (event.target.closest('.tab-close, .tab-add')) {
                return;
            }

            isMouseDown = true;
            pointerStartX = event.clientX;
            startScrollLeft = tabBar.scrollLeft;
            isDraggingTabs = false;
        });

        window.addEventListener('mousemove', event => {
            if (!isMouseDown) {
                return;
            }

            const deltaX = event.clientX - pointerStartX;
            if (!isDraggingTabs && Math.abs(deltaX) < dragThreshold) {
                return;
            }

            if (!isDraggingTabs) {
                isDraggingTabs = true;
                tabBar.dataset.draggingTabs = 'true';
            }

            event.preventDefault();
            tabBar.scrollLeft = startScrollLeft - deltaX;
        });

        window.addEventListener('mouseup', () => {
            if (!isMouseDown) {
                return;
            }

            if (isDraggingTabs) {
                suppressTabClick = true;
                window.setTimeout(() => {
                    suppressTabClick = false;
                }, 0);
            }

            finishTabDrag();
        });

        window.addEventListener('blur', () => {
            finishTabDrag();
        });

        tabBar.addEventListener('click', event => {
            if (!suppressTabClick) {
                return;
            }

            suppressTabClick = false;
            event.preventDefault();
            event.stopImmediatePropagation();
        }, true);

        tabBar.addEventListener('click', event => {
            if (event.target.closest('.tab-close')) {
                return;
            }

            const item = event.target.closest('.tab-item');
            if (!item || !tabBar.contains(item)) {
                return;
            }

            activateTab(item);
        });

        tabBar.addEventListener('keydown', event => {
            if (event.target.closest('.tab-close')) {
                return;
            }

            const currentTab = event.target.closest('.tab-item');
            if (!currentTab || !tabBar.contains(currentTab)) {
                return;
            }

            const tabs = getTabs();
            const currentIndex = tabs.indexOf(currentTab);
            let nextIndex = currentIndex;

            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                nextIndex = (currentIndex + 1) % tabs.length;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            } else if (event.key === 'Home') {
                nextIndex = 0;
            } else if (event.key === 'End') {
                nextIndex = tabs.length - 1;
            } else if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                activateTab(currentTab);
                return;
            } else {
                return;
            }

            event.preventDefault();
            activateTab(tabs[nextIndex], { focus: true });
        });

        tabBar.addEventListener('click', event => {
            const closeButton = event.target.closest('.tab-close');
            if (!closeButton) {
                return;
            }

            const item = closeButton.closest('.tab-item');
            if (!item) {
                return;
            }

            const tabs = getTabs();
            const index = tabs.indexOf(item);
            const wasActive = item.classList.contains('is-active');

            item.remove();

            if (wasActive) {
                const remainingTabs = getTabs();
                if (remainingTabs.length > 0) {
                    activateTab(remainingTabs[Math.min(index, remainingTabs.length - 1)], { focus: true });
                }
            } else {
                const initialActiveTab = syncTabs();
                centerTabInView(initialActiveTab, 'auto');
            }
        });

        const addWrapper = tabBar.querySelector('.tab-add');
        const addButton = addWrapper ? addWrapper.querySelector('button') : null;
        if (addButton) {
            addButton.addEventListener('click', () => {
                tabCounter += 1;
                const label = `Form ${tabCounter}`;
                const tab = document.createElement('div');
                tab.className = 'tab-item';
                tab.setAttribute('role', 'tab');
                tab.setAttribute('aria-selected', 'false');
                tab.setAttribute('tabindex', '-1');
                tab.innerHTML = `
                    <span class="tab-label">${label}</span>
                    <button type="button" class="tab-close" aria-label="Close ${label}">
                        <i class="ri-close-line" aria-hidden="true"></i>
                    </button>
                `;
                tabBar.insertBefore(tab, addWrapper);
                window.requestAnimationFrame(() => {
                    activateTab(tab, { focus: true, behavior: 'smooth' });
                });
            });
        }

        const initialActiveTab = syncTabs();
        centerTabInView(initialActiveTab, 'auto');
    });
});
/**
 * Range Slider Component Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-range-slider]').forEach(slider => {
        if (slider.dataset.rangeSliderBound === 'true') {
            return;
        }

        slider.dataset.rangeSliderBound = 'true';

        const startInput = slider.querySelector('[data-range-slider-start]');
        const endInput = slider.querySelector('[data-range-slider-end]');
        const startOutput = slider.querySelector('[data-range-slider-start-output]');
        const endOutput = slider.querySelector('[data-range-slider-end-output]');
        const unit = (slider.dataset.rangeSliderUnit || '').trim();

        if (!startInput || !endInput) {
            return;
        }

        const syncRange = changedInput => {
            const min = Math.min(Number(startInput.min || 0), Number(endInput.min || 0));
            const max = Math.max(Number(startInput.max || 100), Number(endInput.max || 100));
            let nextStart = clampRangeValue(Number(startInput.value), min, max);
            let nextEnd = clampRangeValue(Number(endInput.value), min, max);

            if (changedInput === startInput && nextStart > nextEnd) {
                nextEnd = nextStart;
            }

            if (changedInput === endInput && nextEnd < nextStart) {
                nextStart = nextEnd;
            }

            startInput.value = String(nextStart);
            endInput.value = String(nextEnd);

            if (startOutput) {
                startOutput.textContent = String(nextStart);
            }

            if (endOutput) {
                endOutput.textContent = String(nextEnd);
            }

            const startPercent = toRangePercent(nextStart, min, max);
            const endPercent = toRangePercent(nextEnd, min, max);
            const startRatio = startPercent / 100;
            const endRatio = endPercent / 100;
            const formatValueText = value => unit ? `${value} ${unit}` : String(value);

            slider.style.setProperty('--range-slider-start-ratio', String(startRatio));
            slider.style.setProperty('--range-slider-end-ratio', String(endRatio));
            startInput.setAttribute('aria-valuetext', formatValueText(nextStart));
            endInput.setAttribute('aria-valuetext', formatValueText(nextEnd));
        };

        startInput.addEventListener('input', () => {
            syncRange(startInput);
        });

        endInput.addEventListener('input', () => {
            syncRange(endInput);
        });

        startInput.addEventListener('change', () => {
            syncRange(startInput);
        });

        endInput.addEventListener('change', () => {
            syncRange(endInput);
        });

        syncRange(startInput);
    });

    function clampRangeValue(value, min, max) {
        if (Number.isNaN(value)) {
            return min;
        }

        return Math.min(Math.max(value, min), max);
    }

    function toRangePercent(value, min, max) {
        if (max === min) {
            return 0;
        }

        return Number((((value - min) / (max - min)) * 100).toFixed(4));
    }
});
/**
 * Progress Bar Demo Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const progressSection = document.querySelector('#progress-bar');

    if (!progressSection) {
        return;
    }

    const progressMeters = Array.from(progressSection.querySelectorAll('[data-progress-meter]'));

    if (progressMeters.length === 0) {
        return;
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animationFrames = new Map();

    const formatPercent = value => `${Math.round(value)}%`;

    const syncProgressMeter = meter => {
        const progress = meter.querySelector('[data-progress-demo]');
        const output = meter.querySelector('[data-progress-output]');

        if (!progress) {
            return;
        }

        const roundedValue = Math.round(Number(progress.value || 0));
        progress.textContent = formatPercent(roundedValue);
        progress.setAttribute('aria-valuetext', formatPercent(roundedValue));

        if (output) {
            output.textContent = formatPercent(roundedValue);
        }
    };

    const stopProgressAnimation = meter => {
        const frameId = animationFrames.get(meter);

        if (typeof frameId === 'number') {
            cancelAnimationFrame(frameId);
            animationFrames.delete(meter);
        }
    };

    const startProgressAnimation = meter => {
        const progress = meter.querySelector('[data-progress-demo]');

        if (!progress) {
            return;
        }

        stopProgressAnimation(meter);
        syncProgressMeter(meter);

        if (reducedMotionQuery.matches) {
            return;
        }

        const min = Number(progress.dataset.progressMin || 0);
        const max = Number(progress.dataset.progressMax || progress.max || 100);
        const duration = Math.max(Number(progress.dataset.progressDuration || 3200), 1200);
        const travel = Math.max(max - min, 1);
        let current = Number(progress.value || min);
        let direction = 1;
        let lastTime = 0;

        const animate = time => {
            if (!lastTime) {
                lastTime = time;
            }

            const delta = time - lastTime;
            lastTime = time;
            current += ((travel / duration) * delta) * direction;

            if (current >= max) {
                current = max;
                direction = -1;
            } else if (current <= min) {
                current = min;
                direction = 1;
            }

            progress.value = String(current);
            syncProgressMeter(meter);
            animationFrames.set(meter, requestAnimationFrame(animate));
        };

        animationFrames.set(meter, requestAnimationFrame(animate));
    };

    const handleMotionChange = () => {
        progressMeters.forEach(meter => {
            startProgressAnimation(meter);
        });
    };

    progressMeters.forEach(meter => {
        startProgressAnimation(meter);
    });

    if (typeof reducedMotionQuery.addEventListener === 'function') {
        reducedMotionQuery.addEventListener('change', handleMotionChange);
    } else if (typeof reducedMotionQuery.addListener === 'function') {
        reducedMotionQuery.addListener(handleMotionChange);
    }
});

/**
 * Combobox Component Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const comboboxes = Array.from(document.querySelectorAll('[data-combobox]'));

    if (comboboxes.length === 0) {
        return;
    }

    let openCombobox = null;

    comboboxes.forEach((combobox, index) => {
        if (combobox.dataset.comboboxBound === 'true') {
            return;
        }

        combobox.dataset.comboboxBound = 'true';

        const input = combobox.querySelector('[data-combobox-input]');
        const panel = combobox.querySelector('[data-combobox-panel]');
        const list = panel?.querySelector('.combobox-list');
        const valueField = combobox.querySelector('[data-combobox-value]');
        const clearButton = combobox.querySelector('[data-combobox-clear]');
        const emptyState = combobox.querySelector('.combobox-empty');
        const options = Array.from(combobox.querySelectorAll('[data-combobox-option]'));

        if (!input || !panel || !list || !clearButton || options.length === 0) {
            return;
        }

        const listId = list.id || `comboboxList${index + 1}`;
        let selectedOption = options.find(option => option.getAttribute('aria-selected') === 'true') || null;
        let activeOption = selectedOption;

        list.id = listId;
        list.setAttribute('role', 'listbox');
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-controls', listId);
        input.setAttribute('aria-expanded', 'false');
        input.setAttribute('aria-autocomplete', 'list');
        input.setAttribute('autocomplete', 'off');

        options.forEach((option, optionIndex) => {
            option.id = option.id || `${listId}-option-${optionIndex + 1}`;
            option.addEventListener('click', () => {
                selectOption(option);
                closeComboboxPanel(combobox, false);
                input.focus();
            });
        });

        combobox._closeCombobox = restoreSelection => {
            closeComboboxPanel(combobox, restoreSelection);
        };

        syncSelectedOption(true);
        updateFilter('');

        input.addEventListener('focus', () => {
            openComboboxPanel(combobox, false);
        });

        input.addEventListener('click', () => {
            openComboboxPanel(combobox, false);
        });

        input.addEventListener('input', () => {
            selectedOption = null;
            syncSelectedOption(false);
            openComboboxPanel(combobox, false);
            updateFilter(input.value.trim());
        });

        input.addEventListener('keydown', event => {
            const visibleOptions = getVisibleOptions();

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                openComboboxPanel(combobox, false);
                if (visibleOptions.length === 0) {
                    return;
                }
                const currentIndex = visibleOptions.indexOf(activeOption);
                const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % visibleOptions.length;
                setActiveOption(visibleOptions[nextIndex]);
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                openComboboxPanel(combobox, false);
                if (visibleOptions.length === 0) {
                    return;
                }
                const currentIndex = visibleOptions.indexOf(activeOption);
                const nextIndex = currentIndex === -1 ? visibleOptions.length - 1 : (currentIndex - 1 + visibleOptions.length) % visibleOptions.length;
                setActiveOption(visibleOptions[nextIndex]);
            }

            if (event.key === 'Home') {
                if (!combobox.classList.contains('is-open')) {
                    return;
                }
                event.preventDefault();
                setActiveOption(visibleOptions[0] || null);
            }

            if (event.key === 'End') {
                if (!combobox.classList.contains('is-open')) {
                    return;
                }
                event.preventDefault();
                setActiveOption(visibleOptions[visibleOptions.length - 1] || null);
            }

            if (event.key === 'Enter') {
                if (!combobox.classList.contains('is-open') || !activeOption) {
                    return;
                }
                event.preventDefault();
                selectOption(activeOption);
                closeComboboxPanel(combobox, false);
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                closeComboboxPanel(combobox, true);
            }

            if (event.key === 'Tab') {
                closeComboboxPanel(combobox, true);
            }
        });

        clearButton.addEventListener('click', event => {
            event.preventDefault();
            clearSelection(true);
            openComboboxPanel(combobox, false);
            input.focus();
        });

        function openComboboxPanel(currentCombobox, focusFirstOption) {
            if (openCombobox && openCombobox !== currentCombobox) {
                openCombobox._closeCombobox?.(true);
            }

            currentCombobox.classList.add('is-open');
            panel.hidden = false;
            input.setAttribute('aria-expanded', 'true');
            openCombobox = currentCombobox;
            updateFilter(input.value.trim());

            if (focusFirstOption) {
                setActiveOption(getVisibleOptions()[0] || null);
            }
        }

        function closeComboboxPanel(currentCombobox, restoreSelection) {
            currentCombobox.classList.remove('is-open');
            panel.hidden = true;
            input.setAttribute('aria-expanded', 'false');
            setActiveOption(null);
            updateFilter('');

            if (restoreSelection) {
                input.value = selectedOption ? getOptionLabel(selectedOption) : '';
            }

            updateClearState();

            if (openCombobox === currentCombobox) {
                openCombobox = null;
            }
        }

        function selectOption(option) {
            selectedOption = option;
            input.value = getOptionLabel(option);
            syncSelectedOption(false);
        }

        function clearSelection(clearInput) {
            selectedOption = null;
            activeOption = null;
            options.forEach(option => {
                option.setAttribute('aria-selected', 'false');
            });
            if (valueField) {
                valueField.value = '';
            }
            combobox.classList.remove('has-value');
            if (clearInput) {
                input.value = '';
            }
            updateClearState();
            updateFilter(input.value.trim());
        }

        function syncSelectedOption(restoreInput) {
            options.forEach(option => {
                option.setAttribute('aria-selected', option === selectedOption ? 'true' : 'false');
            });

            if (valueField) {
                valueField.value = selectedOption ? (selectedOption.dataset.value || getOptionLabel(selectedOption)) : '';
            }

            combobox.classList.toggle('has-value', Boolean(selectedOption));

            if (restoreInput) {
                input.value = selectedOption ? getOptionLabel(selectedOption) : '';
            }

            updateClearState();
        }

        function updateFilter(query) {
            const normalizedQuery = query.trim().toLowerCase();

            options.forEach(option => {
                const matches = normalizedQuery === '' || getOptionLabel(option).toLowerCase().includes(normalizedQuery);
                option.hidden = !matches;
            });

            const visibleOptions = getVisibleOptions();
            if (emptyState) {
                emptyState.hidden = visibleOptions.length !== 0;
            }

            const nextActiveOption = visibleOptions.includes(activeOption)
                ? activeOption
                : (visibleOptions.includes(selectedOption) ? selectedOption : (visibleOptions[0] || null));

            setActiveOption(nextActiveOption);
        }

        function updateClearState() {
            clearButton.disabled = input.value.trim() === '' && (!valueField || valueField.value === '');
        }

        function setActiveOption(option) {
            activeOption = option;

            options.forEach(currentOption => {
                currentOption.classList.toggle('is-active', currentOption === option && !currentOption.hidden);
            });

            if (option && !option.hidden) {
                input.setAttribute('aria-activedescendant', option.id);
                option.scrollIntoView({ block: 'nearest' });
                return;
            }

            input.removeAttribute('aria-activedescendant');
        }

        function getVisibleOptions() {
            return options.filter(option => !option.hidden && option.getAttribute('aria-disabled') !== 'true');
        }

        function getOptionLabel(option) {
            return option.textContent.replace(/\s+/g, ' ').trim();
        }
    });

    document.addEventListener('click', event => {
        if (!openCombobox || openCombobox.contains(event.target)) {
            return;
        }

        openCombobox._closeCombobox?.(true);
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !openCombobox) {
            return;
        }

        openCombobox._closeCombobox?.(true);
        openCombobox.querySelector('[data-combobox-input]')?.focus();
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
        const pageList = pagination.querySelector('.pagination-list');
        const prevBtn = pagination.querySelector('[data-pagination-prev]');
        const nextBtn = pagination.querySelector('[data-pagination-next]');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (pageButtons.length === 0) {
            return;
        }

        const getActiveIndex = () => {
            const activeIndex = pageButtons.findIndex(button => button.getAttribute('aria-current') === 'page');
            return activeIndex === -1 ? 0 : activeIndex;
        };

        const revealActivePage = activeButton => {
            if (!pageList || !activeButton) {
                return;
            }

            const listRect = pageList.getBoundingClientRect();
            const buttonRect = activeButton.getBoundingClientRect();
            const isOutOfView = buttonRect.left < listRect.left || buttonRect.right > listRect.right;

            if (!isOutOfView) {
                return;
            }

            const nextScrollLeft = activeButton.offsetLeft - ((pageList.clientWidth - activeButton.offsetWidth) / 2);
            pageList.scrollTo({
                left: Math.max(0, nextScrollLeft),
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
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

            revealActivePage(pageButtons[safeIndex]);
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
 * Data Table Component Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-table]').forEach(tableWrapper => {
        if (tableWrapper.dataset.tableBound === 'true') {
            return;
        }

        tableWrapper.dataset.tableBound = 'true';

        const table = tableWrapper.querySelector('.data-table-table');
        const tableBody = table?.tBodies?.[0];
        const sortButtons = Array.from(tableWrapper.querySelectorAll('[data-table-sort]'));

        if (!table || !tableBody || sortButtons.length === 0) {
            return;
        }

        sortButtons.forEach(button => {
            const heading = button.closest('.data-table-heading');
            if (heading && !heading.hasAttribute('aria-sort')) {
                heading.setAttribute('aria-sort', 'none');
            }

            button.addEventListener('click', () => {
                const currentHeading = button.closest('.data-table-heading');
                if (!currentHeading) {
                    return;
                }

                const currentDirection = currentHeading.getAttribute('aria-sort') === 'ascending' ? 'ascending' : 'descending';
                const nextDirection = currentDirection === 'ascending' ? 'descending' : 'ascending';
                sortRows(currentHeading, nextDirection);
            });
        });

        const activeHeading = sortButtons
            .map(button => button.closest('.data-table-heading'))
            .find(heading => heading && heading.getAttribute('aria-sort') && heading.getAttribute('aria-sort') !== 'none');

        if (activeHeading) {
            sortRows(activeHeading, activeHeading.getAttribute('aria-sort'));
        }

        function sortRows(activeHeading, direction) {
            const columnIndex = activeHeading.cellIndex;
            const rows = Array.from(tableBody.rows);

            rows.sort((firstRow, secondRow) => {
                const firstValue = getCellValue(firstRow, columnIndex);
                const secondValue = getCellValue(secondRow, columnIndex);
                return compareCellValues(firstValue, secondValue, direction);
            });

            rows.forEach(row => {
                tableBody.appendChild(row);
            });

            sortButtons.forEach(button => {
                const heading = button.closest('.data-table-heading');
                if (!heading) {
                    return;
                }

                heading.setAttribute('aria-sort', heading === activeHeading ? direction : 'none');
            });
        }

        function getCellValue(row, columnIndex) {
            const cell = row.cells[columnIndex];
            if (!cell) {
                return '';
            }

            return (cell.dataset.sortValue || cell.textContent || '').replace(/\s+/g, ' ').trim();
        }

        function compareCellValues(firstValue, secondValue, direction) {
            const firstNumeric = Number(firstValue.replace(/[^0-9.-]/g, ''));
            const secondNumeric = Number(secondValue.replace(/[^0-9.-]/g, ''));
            const bothNumeric = !Number.isNaN(firstNumeric)
                && !Number.isNaN(secondNumeric)
                && /[0-9]/.test(firstValue)
                && /[0-9]/.test(secondValue);

            if (bothNumeric) {
                return direction === 'ascending' ? firstNumeric - secondNumeric : secondNumeric - firstNumeric;
            }

            return direction === 'ascending'
                ? firstValue.localeCompare(secondValue, undefined, { numeric: true, sensitivity: 'base' })
                : secondValue.localeCompare(firstValue, undefined, { numeric: true, sensitivity: 'base' });
        }
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
    const presetLabels = {
        week: 'This Week',
        'next-7-days': 'Next 7 Days',
        month: 'This Month',
    };
    let openPicker = null;

    datePickers.forEach((picker, index) => {
        const input = picker.querySelector('[data-date-picker-input]');
        const singleValueField = picker.querySelector('[data-date-picker-value]');
        const rangeStartField = picker.querySelector('[data-date-picker-range-start-value]');
        const rangeEndField = picker.querySelector('[data-date-picker-range-end-value]');
        const trigger = picker.querySelector('[data-date-picker-trigger]');
        const panel = picker.querySelector('[data-date-picker-panel]');
        const monthLabel = picker.querySelector('[data-date-picker-month]');
        const weekdayRow = picker.querySelector('[data-date-picker-weekdays]');
        const daysGrid = picker.querySelector('[data-date-picker-days]');
        const summary = picker.querySelector('[data-date-picker-summary]');
        const prevButton = picker.querySelector('[data-date-picker-prev]');
        const nextButton = picker.querySelector('[data-date-picker-next]');
        const todayButton = picker.querySelector('[data-date-picker-today]');
        const clearButton = picker.querySelector('[data-date-picker-clear]');
        const presetButtons = Array.from(picker.querySelectorAll('[data-date-picker-preset]'));

        if (!input || !trigger || !panel || !monthLabel || !weekdayRow || !daysGrid || !summary || !prevButton || !nextButton) {
            return;
        }

        const mode = picker.dataset.datePickerMode === 'range' ? 'range' : 'single';
        const defaultDate = parseISODate(picker.dataset.datePickerDefault);
        const defaultRangeStart = parseISODate(picker.dataset.datePickerRangeStart);
        const defaultRangeEnd = parseISODate(picker.dataset.datePickerRangeEnd);
        const anchorDate = mode === 'range' ? (defaultRangeStart || defaultDate) : defaultDate;
        const viewDate = anchorDate || stripTime(new Date());
        const panelIdBase = input.id || 'datePicker' + String(index + 1);

        panel.id = panel.id || `${panelIdBase}-panel`;

        picker._datePickerState = {
            mode,
            selectedDate: defaultDate,
            rangeStart: defaultRangeStart,
            rangeEnd: defaultRangeEnd,
            activePreset: mode === 'range' ? (picker.dataset.datePickerPreset || '') : '',
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

        todayButton?.addEventListener('click', () => {
            selectDate(picker, stripTime(new Date()), true);
        });

        clearButton?.addEventListener('click', () => {
            clearSelection(picker);
        });

        presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const preset = button.dataset.datePickerPreset;
                if (!preset) {
                    return;
                }

                applyPreset(picker, preset);
            });
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

        function renderWeekdays(weekdayContainer) {
            const labels = weekdayLabels.map(label => {
                const element = document.createElement('span');
                element.textContent = label;
                return element;
            });

            weekdayContainer.replaceChildren(...labels);
        }

        function renderDatePicker(currentPicker) {
            const state = currentPicker._datePickerState;
            const monthTarget = currentPicker.querySelector('[data-date-picker-month]');
            const daysTarget = currentPicker.querySelector('[data-date-picker-days]');
            const summaryTarget = currentPicker.querySelector('[data-date-picker-summary]');
            const visibleMonth = new Date(state.viewYear, state.viewMonth, 1);
            const today = stripTime(new Date());

            monthTarget.textContent = monthFormatter.format(visibleMonth);

            if (state.mode === 'range') {
                input.value = formatRangeInput(state.rangeStart, state.rangeEnd);
                if (singleValueField) {
                    singleValueField.value = '';
                }
                if (rangeStartField) {
                    rangeStartField.value = state.rangeStart ? toISODate(state.rangeStart) : '';
                }
                if (rangeEndField) {
                    rangeEndField.value = state.rangeEnd ? toISODate(state.rangeEnd) : '';
                }
                summaryTarget.textContent = formatRangeSummary(state);
                syncPresetButtons(currentPicker);
            } else {
                input.value = state.selectedDate ? inputFormatter.format(state.selectedDate) : '';
                if (singleValueField) {
                    singleValueField.value = state.selectedDate ? toISODate(state.selectedDate) : '';
                }
                if (rangeStartField) {
                    rangeStartField.value = '';
                }
                if (rangeEndField) {
                    rangeEndField.value = '';
                }
                summaryTarget.textContent = state.selectedDate ? summaryFormatter.format(state.selectedDate) : 'No date selected';
            }

            const firstVisibleDay = new Date(state.viewYear, state.viewMonth, 1);
            const offset = (firstVisibleDay.getDay() + 6) % 7;
            firstVisibleDay.setDate(firstVisibleDay.getDate() - offset);

            const buttons = [];

            for (let dayIndex = 0; dayIndex < 42; dayIndex += 1) {
                const dayDate = new Date(firstVisibleDay);
                dayDate.setDate(firstVisibleDay.getDate() + dayIndex);

                const dayButton = document.createElement('button');
                const classNames = ['date-picker-day'];
                const isSelected = state.mode === 'single' && state.selectedDate && isSameDay(dayDate, state.selectedDate);
                const isRangeStart = state.mode === 'range' && state.rangeStart && isSameDay(dayDate, state.rangeStart);
                const isRangeEnd = state.mode === 'range' && state.rangeEnd && isSameDay(dayDate, state.rangeEnd);
                const isInRange = state.mode === 'range' && isDateInRange(dayDate, state.rangeStart, state.rangeEnd);
                const isPressed = Boolean(isSelected || isRangeStart || isRangeEnd || isInRange);

                dayButton.type = 'button';
                dayButton.dataset.datePickerDay = toISODate(dayDate);
                dayButton.textContent = String(dayDate.getDate());
                dayButton.setAttribute('aria-label', ariaFormatter.format(dayDate));
                dayButton.setAttribute('aria-pressed', isPressed ? 'true' : 'false');

                if (dayDate.getMonth() !== state.viewMonth) {
                    classNames.push('is-outside');
                }

                if (isSameDay(dayDate, today)) {
                    classNames.push('is-today');
                    dayButton.setAttribute('aria-current', 'date');
                }

                if (isInRange) {
                    classNames.push('is-in-range');
                }

                if (isSelected) {
                    classNames.push('is-selected');
                }

                if (isRangeStart) {
                    classNames.push('is-range-start', 'is-selected');
                }

                if (isRangeEnd) {
                    classNames.push('is-range-end', 'is-selected');
                }

                dayButton.className = classNames.join(' ');
                buttons.push(dayButton);
            }

            daysTarget.replaceChildren(...buttons);
        }

        function openDatePicker(currentPicker, focusSelectedDay) {
            datePickers.forEach(otherPicker => {
                if (otherPicker === currentPicker || isStickyPicker(otherPicker)) {
                    return;
                }

                otherPicker.classList.remove('is-open');
                const otherPanel = otherPicker.querySelector('[data-date-picker-panel]');
                if (otherPanel) {
                    otherPanel.hidden = true;
                }
                otherPicker.querySelector('[data-date-picker-trigger]')?.setAttribute('aria-expanded', 'false');
                otherPicker.querySelector('[data-date-picker-input]')?.setAttribute('aria-expanded', 'false');
            });

            currentPicker.classList.add('is-open');
            panel.hidden = false;
            setExpandedState(currentPicker, true);
            openPicker = currentPicker;

            if (focusSelectedDay) {
                requestAnimationFrame(() => {
                    focusPreferredDay(currentPicker);
                });
            }
        }

        function closeDatePicker(currentPicker, restoreFocus) {
            currentPicker.classList.remove('is-open');
            panel.hidden = true;
            setExpandedState(currentPicker, false);

            if (openPicker === currentPicker) {
                openPicker = null;
            }

            if (restoreFocus) {
                currentPicker.querySelector('[data-date-picker-trigger]')?.focus();
            }
        }

        function setExpandedState(currentPicker, isOpen) {
            const nextValue = isOpen ? 'true' : 'false';
            currentPicker.querySelector('[data-date-picker-trigger]')?.setAttribute('aria-expanded', nextValue);
            currentPicker.querySelector('[data-date-picker-input]')?.setAttribute('aria-expanded', nextValue);
        }

        function shiftViewMonth(currentPicker, direction) {
            const state = currentPicker._datePickerState;
            const nextDate = new Date(state.viewYear, state.viewMonth + direction, 1);

            state.viewYear = nextDate.getFullYear();
            state.viewMonth = nextDate.getMonth();
            renderDatePicker(currentPicker);

            requestAnimationFrame(() => {
                focusPreferredDay(currentPicker);
            });
        }

        function selectDate(currentPicker, date, closeAfterSelect) {
            const normalizedDate = stripTime(date);
            const state = currentPicker._datePickerState;

            if (state.mode === 'range') {
                state.activePreset = '';

                if (!state.rangeStart || (state.rangeStart && state.rangeEnd)) {
                    state.rangeStart = normalizedDate;
                    state.rangeEnd = null;
                } else if (normalizedDate.getTime() < state.rangeStart.getTime()) {
                    state.rangeEnd = state.rangeStart;
                    state.rangeStart = normalizedDate;
                } else {
                    state.rangeEnd = normalizedDate;
                }

                state.selectedDate = normalizedDate;
                state.viewYear = normalizedDate.getFullYear();
                state.viewMonth = normalizedDate.getMonth();
                renderDatePicker(currentPicker);

                if (closeAfterSelect && state.rangeStart && state.rangeEnd && !isStickyPicker(currentPicker)) {
                    closeDatePicker(currentPicker, true);
                }

                return;
            }

            state.selectedDate = normalizedDate;
            state.viewYear = normalizedDate.getFullYear();
            state.viewMonth = normalizedDate.getMonth();
            renderDatePicker(currentPicker);

            if (closeAfterSelect && !isStickyPicker(currentPicker)) {
                closeDatePicker(currentPicker, true);
            }
        }

        function applyPreset(currentPicker, preset) {
            const state = currentPicker._datePickerState;
            if (state.mode !== 'range') {
                return;
            }

            const today = stripTime(new Date());
            let nextStart = null;
            let nextEnd = null;

            switch (preset) {
                case 'week':
                    nextStart = startOfWeek(today);
                    nextEnd = endOfWeek(today);
                    break;
                case 'next-7-days':
                    nextStart = today;
                    nextEnd = addDays(today, 6);
                    break;
                case 'month':
                    nextStart = startOfMonth(today);
                    nextEnd = endOfMonth(today);
                    break;
                default:
                    clearSelection(currentPicker);
                    return;
            }

            state.rangeStart = nextStart;
            state.rangeEnd = nextEnd;
            state.selectedDate = nextStart;
            state.activePreset = preset;
            state.viewYear = nextStart.getFullYear();
            state.viewMonth = nextStart.getMonth();
            renderDatePicker(currentPicker);
            openDatePicker(currentPicker, false);

            requestAnimationFrame(() => {
                focusPreferredDay(currentPicker);
            });
        }

        function clearSelection(currentPicker) {
            const state = currentPicker._datePickerState;

            if (state.mode === 'range') {
                state.rangeStart = null;
                state.rangeEnd = null;
                state.selectedDate = null;
                state.activePreset = '';
            } else {
                state.selectedDate = null;
            }

            renderDatePicker(currentPicker);
        }

        function syncPresetButtons(currentPicker) {
            const state = currentPicker._datePickerState;

            presetButtons.forEach(button => {
                const isActive = button.dataset.datePickerPreset === state.activePreset;
                button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
        }

        function focusPreferredDay(currentPicker) {
            const daysTarget = currentPicker.querySelector('[data-date-picker-days]');
            if (!daysTarget) {
                return;
            }

            const preferredButton =
                daysTarget.querySelector('.is-range-end') ||
                daysTarget.querySelector('.is-range-start') ||
                daysTarget.querySelector('.is-selected') ||
                daysTarget.querySelector('.is-today:not(.is-outside)') ||
                daysTarget.querySelector('[data-date-picker-day]');

            preferredButton?.focus();
        }
    });

    document.addEventListener('click', event => {
        datePickers.forEach(picker => {
            if (picker.contains(event.target) || isStickyPicker(picker)) {
                return;
            }

            picker.classList.remove('is-open');
            const panel = picker.querySelector('[data-date-picker-panel]');
            panel.hidden = true;
            picker.querySelector('[data-date-picker-trigger]')?.setAttribute('aria-expanded', 'false');
            picker.querySelector('[data-date-picker-input]')?.setAttribute('aria-expanded', 'false');
        });

        openPicker = datePickers.find(picker => picker.classList.contains('is-open')) || null;
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !openPicker) {
            return;
        }

        openPicker.classList.remove('is-open');
        const panel = openPicker.querySelector('[data-date-picker-panel]');
        panel.hidden = true;
        openPicker.querySelector('[data-date-picker-trigger]')?.setAttribute('aria-expanded', 'false');
        openPicker.querySelector('[data-date-picker-input]')?.setAttribute('aria-expanded', 'false');
        openPicker.querySelector('[data-date-picker-trigger]')?.focus();
        openPicker = null;
    });

    function createWeekdayLabels(localeValue) {
        const formatter = new Intl.DateTimeFormat(localeValue, { weekday: 'short' });
        const mondayStart = new Date(2024, 0, 1);

        return Array.from({ length: 7 }, (_, index) => {
            const weekday = new Date(mondayStart);
            weekday.setDate(mondayStart.getDate() + index);
            return formatter.format(weekday).replace('.', '');
        });
    }

    function formatRangeInput(startDate, endDate) {
        if (!startDate && !endDate) {
            return '';
        }

        if (startDate && endDate) {
            return `${inputFormatter.format(startDate)} - ${inputFormatter.format(endDate)}`;
        }

        return `${inputFormatter.format(startDate)} -`;
    }

    function formatRangeSummary(state) {
        const presetLabel = presetLabels[state.activePreset];

        if (state.rangeStart && state.rangeEnd) {
            const rangeLabel = `${summaryFormatter.format(state.rangeStart)} - ${summaryFormatter.format(state.rangeEnd)}`;
            return presetLabel ? `${presetLabel} - ${rangeLabel}` : `Selected range: ${rangeLabel}`;
        }

        if (state.rangeStart) {
            return `Start date selected: ${summaryFormatter.format(state.rangeStart)}. Choose an end date.`;
        }

        return 'Choose a preset or pick a start and end date.';
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

    function isDateInRange(date, startDate, endDate) {
        if (!startDate || !endDate) {
            return false;
        }

        const currentTime = stripTime(date).getTime();
        return currentTime >= startDate.getTime() && currentTime <= endDate.getTime();
    }

    function addDays(date, amount) {
        const nextDate = stripTime(date);
        nextDate.setDate(nextDate.getDate() + amount);
        return nextDate;
    }

    function startOfWeek(date) {
        const nextDate = stripTime(date);
        const offset = (nextDate.getDay() + 6) % 7;
        nextDate.setDate(nextDate.getDate() - offset);
        return nextDate;
    }

    function endOfWeek(date) {
        return addDays(startOfWeek(date), 6);
    }

    function startOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    function endOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    function isStickyPicker(picker) {
        return picker.dataset.datePickerSticky === 'true';
    }
});

/**
 * Drawer Sheet Component Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const triggers = Array.from(document.querySelectorAll('[data-drawer-target]'));
    const drawers = Array.from(document.querySelectorAll('.drawer-sheet'));

    if (triggers.length === 0 || drawers.length === 0) {
        return;
    }

    let openDrawer = null;

    triggers.forEach(trigger => {
        const targetId = trigger.dataset.drawerTarget;
        if (!targetId) {
            return;
        }

        trigger.setAttribute('aria-controls', targetId);
        trigger.setAttribute('aria-expanded', 'false');

        trigger.addEventListener('click', () => {
            const drawer = drawers.find(item => item.id === targetId);
            if (!drawer) {
                return;
            }

            openDrawerSheet(drawer, trigger);
        });
    });

    drawers.forEach(drawer => {
        drawer.querySelectorAll('[data-drawer-close]').forEach(button => {
            button.addEventListener('click', () => {
                closeDrawerSheet(drawer, true);
            });
        });

        drawer.addEventListener('click', event => {
            if (event.target === drawer) {
                closeDrawerSheet(drawer, true);
            }
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || !openDrawer) {
            return;
        }

        closeDrawerSheet(openDrawer, true);
    });

    function syncTriggerState(targetId, isOpen) {
        triggers
            .filter(trigger => trigger.dataset.drawerTarget === targetId)
            .forEach(trigger => {
                trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
    }

    function syncBodyLock() {
        document.body.classList.toggle('drawer-sheet-open', drawers.some(drawer => drawer.classList.contains('is-open')));
    }

    function openDrawerSheet(drawer, trigger) {
        drawers.forEach(otherDrawer => {
            if (otherDrawer !== drawer) {
                closeDrawerSheet(otherDrawer, false);
            }
        });

        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        drawer._lastTrigger = trigger;
        openDrawer = drawer;
        syncTriggerState(drawer.id, true);
        syncBodyLock();

        requestAnimationFrame(() => {
            const initialFocus = drawer.querySelector('[data-drawer-initial-focus]')
                || drawer.querySelector('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');

            initialFocus?.focus();
        });
    }

    function closeDrawerSheet(drawer, restoreFocus) {
        if (!drawer) {
            return;
        }

        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        syncTriggerState(drawer.id, false);
        syncBodyLock();

        if (openDrawer === drawer) {
            openDrawer = drawers.find(item => item.classList.contains('is-open')) || null;
        }

        if (restoreFocus && drawer._lastTrigger) {
            drawer._lastTrigger.focus();
        }
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

