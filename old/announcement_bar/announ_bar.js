function closeBar(id) {
    const bar = document.getElementById(id);
    if (!bar) return;

    // Add negative margin transitions to smoothly collapse space
    bar.style.transition = "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
    bar.style.opacity = "0";
    bar.style.transform = "translateY(-100%)";
    bar.style.marginTop = `-${bar.offsetHeight}px`; // Collapses the height

    // Optional: Remove from DOM after time
    setTimeout(() => {
        bar.style.display = 'none';
    }, 500);
}
