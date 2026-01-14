/**
 * Accordion Component Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            // Toggle current
            trigger.setAttribute('aria-expanded', !isExpanded);

            // Optional: Close others in the same group (solo mode)
            // Uncomment the lines below if you want only one open at a time
            /*
            if (!isExpanded) {
                accordionTriggers.forEach(otherTrigger => {
                    if (otherTrigger !== trigger) {
                        otherTrigger.setAttribute('aria-expanded', 'false');
                    }
                });
            }
            */
        });
    });
});
