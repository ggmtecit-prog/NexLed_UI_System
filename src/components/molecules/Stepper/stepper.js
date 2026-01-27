/**
 * Stepper Component Logic
 */

function setActiveStep(stepNumber) {
    // Get all step circle elements
    const allCircles = document.querySelectorAll('.step-circle');

    allCircles.forEach((circle, index) => {
        const stepIndex = index + 1;
        const parentBtn = circle.closest('.step-item');

        if (stepIndex === stepNumber) {
            // Set as active
            circle.classList.remove('bg-grey-tertiary', 'text-black');
            circle.classList.add('bg-green-primary', 'text-white', 'shadow-btn-glow');
            if (parentBtn) {
                parentBtn.setAttribute('aria-pressed', 'true');
                parentBtn.setAttribute('aria-current', 'step');
                const label = parentBtn.querySelector('.step-link');
                if (label) {
                    label.classList.add('text-green-primary', 'font-semibold');
                    label.classList.remove('text-black', 'font-medium');
                }
            }
        } else {
            // Set as inactive
            circle.classList.remove('bg-green-primary', 'text-white', 'shadow-btn-glow');
            circle.classList.add('bg-grey-tertiary', 'text-black', 'shadow-btn-default');
            if (parentBtn) {
                parentBtn.setAttribute('aria-pressed', 'false');
                parentBtn.removeAttribute('aria-current');
                const label = parentBtn.querySelector('.step-link');
                if (label) {
                    label.classList.add('text-black', 'font-medium');
                    label.classList.remove('text-green-primary', 'font-semibold');
                }
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
