/**
 * File Uploader Component Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // Setup for Folder Upload
    setupDropZone('folderDropZone', 'folderInput');

    // Setup for File Upload
    setupDropZone('fileDropZone', 'fileInput');

    // Setup for Image Upload
    setupDropZone('imageDropZone', 'imageInput');
});

function setupDropZone(dropZoneId, inputId) {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(inputId);

    if (!dropZone || !fileInput) return;

    // Trigger input on click
    dropZone.addEventListener('click', () => fileInput.click());

    // Handle drag enter and drag over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('!border-green-secondary', '!bg-green-secondary/10');
        });
    });

    // Handle drag leave and drop
    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('!border-green-secondary', '!bg-green-secondary/10');
        });
    });

    // Handle drop event
    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            // You can manually set the files to the input if needed
            // Note: Setting files programmatically has limitations in some browsers
            handleFiles(files, dropZone);
        }
    });

    // Handle file selection via input
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFiles(fileInput.files, dropZone);
        }
    });

    // Hover effect for icon
    dropZone.addEventListener('mouseenter', () => {
        const icon = dropZone.querySelector('.drop-zone__icon');
        if (icon) {
            icon.style.transform = 'translateY(-5px)';
        }
    });

    dropZone.addEventListener('mouseleave', () => {
        const icon = dropZone.querySelector('.drop-zone__icon');
        if (icon) {
            icon.style.transform = 'translateY(0)';
        }
    });
}

function handleFiles(files, dropZone) {
    const text = dropZone.querySelector('.drop-zone__text');
    if (text) {
        const count = files.length;
        const itemWord = count === 1 ? 'item' : 'items';
        text.textContent = `${count} ${itemWord} ready to upload`;
        text.classList.add('text-green-secondary');
    }

    console.log('Files selected:', files);
    // Here you would typically handle the file upload to your server
}
