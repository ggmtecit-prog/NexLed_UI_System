/**
 * Accordion Component Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const content = trigger.nextElementSibling;
            const icon = trigger.querySelector('.chevron-icon');
            const span = trigger.querySelector('span');

            // Toggle current
            trigger.setAttribute('aria-expanded', !isExpanded);

            if (!isExpanded) {
                // Expand
                content.classList.remove('max-h-0', 'opacity-0');
                content.classList.add('opacity-100');
                icon.classList.add('rotate-180', 'text-black');
                icon.classList.remove('text-grey-primary');
                span.classList.add('text-black');
                span.classList.remove('text-grey-primary');
            } else {
                // Collapse
                content.classList.add('max-h-0', 'opacity-0');
                content.classList.remove('opacity-100');
                icon.classList.remove('rotate-180', 'text-black');
                icon.classList.add('text-grey-primary');
                span.classList.remove('text-black');
                span.classList.add('text-grey-primary');
            }

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
