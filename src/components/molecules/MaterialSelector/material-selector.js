/**
 * Material Selector Logic
 * Handles single-selection material buttons
 */

function selectMaterial(element) {
    // 1. Remove selection from all siblings
    const parent = element.parentElement;
    const items = parent.querySelectorAll('.material-item');

    items.forEach(item => {
        item.classList.remove('is-selected');
        const label = item.querySelector('.material-label');
        if (label) {
            label.classList.remove('text-green-secondary', 'font-bold');
            label.classList.add('text-grey-primary');
        }
    });

    // 2. Add selection to clicked element
    element.classList.add('is-selected');
    const label = element.querySelector('.material-label');
    if (label) {
        label.classList.remove('text-grey-primary');
        label.classList.add('text-green-secondary', 'font-bold');
    }

    // Log selection
    const materialName = label ? label.textContent : 'Unknown';
    console.log('Selected material:', materialName);
}

// Set first item as selected by default
document.addEventListener('DOMContentLoaded', () => {
    const firstItem = document.querySelector('.material-item');
    if (firstItem) {
        selectMaterial(firstItem);
    }
});
