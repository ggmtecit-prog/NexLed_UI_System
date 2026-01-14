/* ============================================================
   Scrollbar Design Component Scripts
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.scroll-container');
    let scrollTimeout;

    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', () => {
            // Add the scrolling class
            scrollContainer.classList.add('is-scrolling');

            // Clear existing timeout
            clearTimeout(scrollTimeout);

            // Remove the class after 1 second of inactivity
            scrollTimeout = setTimeout(() => {
                scrollContainer.classList.remove('is-scrolling');
            }, 800);
        });
    }
});
