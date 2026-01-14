/**
 * Announcement Bar Component Logic
 */

function closeBar(id) {
    const bar = document.getElementById(id);
    if (!bar) return;

    // Smooth collapse animation
    bar.style.transition = "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    bar.style.opacity = "0";
    bar.style.transform = "translateY(-100%)";
    bar.style.marginTop = `-${bar.offsetHeight}px`;

    // Remove from DOM after animation
    setTimeout(() => {
        bar.style.display = 'none';
    }, 500);
}
