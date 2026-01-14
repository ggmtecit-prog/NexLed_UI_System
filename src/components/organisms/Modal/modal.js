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
