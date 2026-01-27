/**
 * Announcement Bar Component Logic
 */

function closeBar(id) {
    const bar = document.getElementById(id);
    if (!bar) return;

    // Smooth collapse animation
    // Note: CSS classes handle ease-premium, JS triggers the state change
    bar.style.opacity = "0";
    bar.style.transform = "translateY(-100%)";
    bar.style.marginTop = `-${bar.offsetHeight}px`;

    // Remove from DOM after animation (400ms match)
    setTimeout(() => {
        bar.style.display = 'none';
    }, 400);
}
