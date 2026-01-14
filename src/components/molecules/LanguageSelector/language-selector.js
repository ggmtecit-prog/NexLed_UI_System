/**
 * Language Selector Logic
 */

function toggleLangMenu(button) {
    const container = button.closest('.language-selector-root');
    const menu = container.querySelector('[role="menu"]');
    const arrow = button.querySelector('.arrow-icon');

    // Check current state
    const isClosed = menu.classList.contains('invisible');

    // Close all other menus first
    closeAllLangMenus();

    if (isClosed) {
        // Open
        menu.classList.remove('opacity-0', 'invisible', 'scale-95');
        menu.classList.add('opacity-100', 'visible', 'scale-100');
        arrow.classList.add('rotate-180', 'text-green-secondary');
        arrow.classList.remove('text-grey-primary');
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
        const menu = container.querySelector('[role="menu"]');
        const arrow = container.querySelector('.arrow-icon');
        const button = container.querySelector('button');

        menu.classList.add('opacity-0', 'invisible', 'scale-95');
        menu.classList.remove('opacity-100', 'visible', 'scale-100');
        if (arrow) {
            arrow.classList.remove('rotate-180', 'text-green-secondary');
            arrow.classList.add('text-grey-primary');
        }
        button.setAttribute('aria-expanded', 'false');
    });
}

// Close ALL menus when clicking outside
document.addEventListener('click', function (event) {
    if (!event.target.closest('.language-selector-root')) {
        closeAllLangMenus();
    }
});
