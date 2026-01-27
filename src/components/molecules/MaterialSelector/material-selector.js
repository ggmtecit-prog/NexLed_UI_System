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

        // restore label styles
        const label = item.querySelector('.material-label');
        if (label) {
            label.classList.remove('text-green-secondary', 'font-bold');
            label.classList.add('text-grey-primary');
        }

        // hide check if present
        const check = item.querySelector('.label-check');
        if (check) {
            check.classList.remove('opacity-100','scale-100');
            check.classList.add('opacity-0','scale-75');
        }

        // reset thumb styles
        const thumb = item.querySelector('.material-thumb');
        if (thumb) {
            thumb.classList.remove('shadow-btn-glow','-translate-y-lift');
            thumb.classList.add('shadow-btn-default');
            const img = thumb.querySelector('.material-img');
            if (img) img.classList.remove('scale-110');
        }
    });

    // 2. Add selection to clicked element
    element.classList.add('is-selected');

    // update label
    const label = element.querySelector('.material-label');
    if (label) {
        label.classList.remove('text-grey-primary');
        label.classList.add('text-green-secondary', 'font-bold');
    }

    // show check icon if present
    const check = element.querySelector('.label-check');
    if (check) {
        check.classList.remove('opacity-0','scale-75');
        check.classList.add('opacity-100','scale-100');
    }

    // uplift thumb and add glow
    const thumb = element.querySelector('.material-thumb');
    if (thumb) {
        thumb.classList.remove('shadow-btn-default');
        thumb.classList.add('shadow-btn-glow','-translate-y-lift');
        const img = thumb.querySelector('.material-img');
        if (img) img.classList.add('scale-110');
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
