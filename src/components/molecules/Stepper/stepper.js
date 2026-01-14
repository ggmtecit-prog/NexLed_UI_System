/**
 * Stepper Component Logic
 */

function setActiveStep(stepNumber) {
    // Get all step number containers
    const allSteps = document.querySelectorAll('.flex.items-center.gap-4 > div');

    allSteps.forEach((stepDiv, index) => {
        const stepIndex = index + 1;

        if (stepIndex === stepNumber) {
            // Set as active
            stepDiv.classList.remove('bg-grey-tertiary', 'text-black');
            stepDiv.classList.add('bg-green-primary', 'text-white', 'shadow-md');
        } else {
            // Set as inactive
            stepDiv.classList.remove('bg-green-primary', 'text-white', 'shadow-md');
            stepDiv.classList.add('bg-grey-tertiary', 'text-black');
        }
    });

    console.log(`Step ${stepNumber} is now active`);
}
