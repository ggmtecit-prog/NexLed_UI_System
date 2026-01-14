document.addEventListener('DOMContentLoaded', () => {

    const wrappers = document.querySelectorAll('.quantity-wrapper');

    wrappers.forEach(wrapper => {
        const input = wrapper.querySelector('.qty-input');
        const decreaseBtn = wrapper.querySelector('.qty-btn[aria-label="Decrease quantity"]');
        const increaseBtn = wrapper.querySelector('.qty-btn[aria-label="Increase quantity"]');

        // Settings
        const min = parseInt(wrapper.dataset.min) || 0;
        const max = parseInt(wrapper.dataset.max) || 999;

        // Initial State Check
        updateState();

        // Event Listeners
        decreaseBtn.addEventListener('click', () => {
            let currentValue = parseInt(input.value) || 0;
            if (currentValue > min) {
                updateValue(currentValue - 1);
            }
        });

        increaseBtn.addEventListener('click', () => {
            let currentValue = parseInt(input.value) || 0;
            if (currentValue < max) {
                updateValue(currentValue + 1);
            }
        });

        // Helper to update value and UI state
        function updateValue(newValue) {
            input.value = newValue;
            updateState();

            // Dispatch change event if other components need to know
            input.dispatchEvent(new Event('change'));
        }

        // Helper to disable buttons at limits
        function updateState() {
            let currentValue = parseInt(input.value) || 0;

            // Check limits
            if (currentValue <= min) {
                decreaseBtn.disabled = true;
                input.value = min; // Enforce min
            } else {
                decreaseBtn.disabled = false;
            }

            if (currentValue >= max) {
                increaseBtn.disabled = true;
                input.value = max; // Enforce max
            } else {
                increaseBtn.disabled = false;
            }
        }
    });

});
