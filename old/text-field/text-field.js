/* ============================================================
   Text Field Component Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Password Visibility Toggle
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('passwordInput');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle icon and aria-pressed
            const icon = toggleBtn.querySelector('i');
            const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
            toggleBtn.setAttribute('aria-pressed', !isPressed);

            icon.classList.toggle('ri-eye-line');
            icon.classList.toggle('ri-eye-off-line');
        });
    }

    // 2. Character Count for Bio
    const bioInput = document.getElementById('bioInput');
    const charCountDisplay = document.getElementById('charCount');

    if (bioInput && charCountDisplay) {
        bioInput.addEventListener('input', () => {
            const length = bioInput.value.length;
            const max = bioInput.getAttribute('maxlength');
            charCountDisplay.textContent = `${length}/${max}`;

            // Visual feedback when reaching limit
            if (length >= max) {
                charCountDisplay.classList.add('text-danger');
                charCountDisplay.classList.remove('text-muted');
            } else {
                charCountDisplay.classList.remove('text-danger');
                charCountDisplay.classList.add('text-muted');
            }
        });
    }

    // 3. Folder Drop Zone Logic
    const dropZone = document.getElementById('folderDropZone');
    const folderInput = document.getElementById('folderInput');

    if (dropZone && folderInput) {
        // Trigger input on click
        dropZone.addEventListener('click', () => folderInput.click());

        // Handle drag states
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
            });
        });

        // Optional: Handle file selection
        folderInput.addEventListener('change', () => {
            if (folderInput.files.length > 0) {
                const text = dropZone.querySelector('.drop-zone__text');
                text.textContent = `${folderInput.files.length} items ready to upload`;
            }
        });
    }
});
