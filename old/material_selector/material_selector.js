/**
 * Material Selector Logic
 * Minimal selection management
 */

function selectMaterial(element) {
    // 1. Remove selection from all siblings
    const parent = element.parentElement;
    const items = parent.querySelectorAll('.material-item');

    items.forEach(item => {
        item.classList.remove('is-selected');
    });

    // 2. Add selection to clicked element
    element.classList.add('is-selected');

    // Optional: console log or perform action
    const label = element.querySelector('.material-label').textContent;
    console.log('Selected material:', label);
}

// Set first item as selected by default
document.addEventListener('DOMContentLoaded', () => {
    const firstItem = document.querySelector('.material-item');
    if (firstItem) {
        firstItem.classList.add('is-selected');
    }
});
