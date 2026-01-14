/* Modal Interaction Logic */

document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const triggerBtn = document.getElementById('modal-trigger');
    const closeIconBtn = document.getElementById('modal-close-icon');
    const secondaryBtn = document.getElementById('modal-action-secondary');
    const backdrop = document.getElementById('modal-backdrop');
    const panel = document.getElementById('modal-panel');

    // Functions
    function openModal() {
        // Show backdrop
        backdrop.classList.add('backdrop-open');
        // Animate panel in (slightly delayed or same time depending on feel)
        // Adding a microtimout allows CSS transition to catch the visibility change if needed, but here simple class toggle works with CSS transitions.
        requestAnimationFrame(() => {
            panel.classList.add('panel-open');
        });

        // Prevent body scroll
        document.body.classList.add('modal-active');
    }

    function closeModal() {
        // Hide panel first
        panel.classList.remove('panel-open');

        // Hide backdrop
        backdrop.classList.remove('backdrop-open');

        // Restore body scroll
        document.body.classList.remove('modal-active');
    }

    // Event Listeners
    if (triggerBtn) triggerBtn.addEventListener('click', openModal);
    if (closeIconBtn) closeIconBtn.addEventListener('click', closeModal);
    if (secondaryBtn) secondaryBtn.addEventListener('click', closeModal);

    // Close on Click Outside
    if (backdrop) {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal();
            }
        });
    }

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop.classList.contains('backdrop-open')) {
            closeModal();
        }
    });

});
