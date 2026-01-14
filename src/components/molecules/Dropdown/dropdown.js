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
                    i.classList.remove('text-green-secondary', 'font-semibold');
                });
                item.setAttribute('aria-selected', 'true');
                item.classList.add('text-green-secondary', 'font-semibold');

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
                const isSelected = item.getAttribute('aria-selected') === 'true';
                item.setAttribute('aria-selected', String(!isSelected));

                if (!isSelected) {
                    item.classList.add('text-green-secondary', 'font-semibold', 'before:bg-green-secondary', 'before:border-green-secondary', 'before:content-["✓"]');
                } else {
                    item.classList.remove('text-green-secondary', 'font-semibold', 'before:bg-green-secondary', 'before:border-green-secondary', 'before:content-["✓"]');
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
            if (e.key === 'Escape') {
                closeDropdown(dropdown);
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
