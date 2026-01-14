/* Toggle behavior (interactive button only)
   - Toggles aria-pressed between "true" and "false"
   - Ensures icon and label colors update because .icon inherits color
   - Mirrors keyboard behavior: Space/Enter toggle
   - Prevents page scroll on Space
*/

document.addEventListener('DOMContentLoaded', () => {
    // Get all toggle buttons (regular and icon-only)
    const toggleButtons = [
        document.getElementById('toggleBtn'),
        document.getElementById('toggleBtnIcon')
    ].filter(Boolean);

    toggleButtons.forEach(btn => {
        // Click toggles state
        btn.addEventListener('click', () => {
            const pressed = btn.getAttribute('aria-pressed') === 'true';
            btn.setAttribute('aria-pressed', String(!pressed));
        });

        // Keyboard: handle Space and Enter
        btn.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault(); // prevent page scroll
                btn.classList.add('keyboard-press');
            }
            if (e.key === 'Enter') {
                btn.classList.add('keyboard-press');
            }
        });

        btn.addEventListener('keyup', (e) => {
            if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
                btn.classList.remove('keyboard-press');
                // Toggle on keyup to match native button behavior
                const pressed = btn.getAttribute('aria-pressed') === 'true';
                btn.setAttribute('aria-pressed', String(!pressed));
            }
        });

        btn.addEventListener('blur', () => btn.classList.remove('keyboard-press'));
    });

    // Disabled buttons: ensure they remain non-interactive (no JS needed)
    // If you want to enable/disable dynamically, you can toggle attributes:
    // disabledBtn.removeAttribute('disabled'); disabledBtn.setAttribute('aria-disabled','false');
});
