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
            }
        });

        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(i => i.removeAttribute('aria-selected'));
                item.setAttribute('aria-selected', 'true');
                valueDisplay.textContent = item.textContent;
                valueDisplay.classList.remove('placeholder');
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
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
            }
        });

        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                // Toggle selection
                const isSelected = item.getAttribute('aria-selected') === 'true';
                item.setAttribute('aria-selected', String(!isSelected));
                // Update value display
                updateMultiValue(dropdown, valueDisplay);
            });
        });

        setupKeyboardNav(dropdown, trigger, items, true);
    });

    function updateMultiValue(dropdown, valueDisplay) {
        const selected = dropdown.querySelectorAll('.dropdown__item[aria-selected="true"]');
        if (selected.length === 0) {
            valueDisplay.textContent = 'Select options';
            valueDisplay.classList.add('placeholder');
        } else if (selected.length === 1) {
            valueDisplay.textContent = selected[0].textContent;
            valueDisplay.classList.remove('placeholder');
        } else {
            valueDisplay.textContent = `${selected.length} selected`;
            valueDisplay.classList.remove('placeholder');
        }
    }

    function setupKeyboardNav(dropdown, trigger, items, isMulti = false) {
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!dropdown.classList.contains('open')) {
                    dropdown.classList.add('open');
                    trigger.setAttribute('aria-expanded', 'true');
                    items[0]?.focus();
                }
            }
            if (e.key === 'Escape') {
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            }
        });

        items.forEach((item, index) => {
            item.setAttribute('tabindex', '-1');
            item.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    items[index + 1]?.focus();
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (index === 0) {
                        trigger.focus();
                    } else {
                        items[index - 1]?.focus();
                    }
                }
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                    if (!isMulti) {
                        trigger.focus();
                    }
                }
                if (e.key === 'Escape') {
                    dropdown.classList.remove('open');
                    trigger.setAttribute('aria-expanded', 'false');
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
            d.classList.remove('open');
            d.querySelector('.dropdown__trigger')?.setAttribute('aria-expanded', 'false');
        });
    }
});
