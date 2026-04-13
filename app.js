// AXIS - ADVANCED INTERACTIVE ENGINE (2D PARALLAX VERSION)
// Fixed: Removed 3D camera dependencies to prevent 'Camera failed' error.

document.addEventListener('DOMContentLoaded', () => {
    const shoe = document.querySelector('.hero-shoe');
    const bgText = document.querySelector('.bg-text');
    const heroContent = document.querySelector('.hero-info');

    if (!shoe) {
        console.error("AXIS ERROR: Hero shoe image not found in the DOM.");
        return;
    }

    document.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to center
        let xAxis = (window.innerWidth / 2 - e.pageX) / 20;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 20;
        
        // Product (Shoe) Parallax - Smooth rotation & position shift
        shoe.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg) translateZ(50px)`;
        shoe.style.filter = `drop-shadow(${xAxis * -1}px ${yAxis * -1}px 40px rgba(0,0,0,0.6))`;

        // Background Text Parallax
        if (bgText) {
            bgText.style.transform = `translateX(${xAxis * 1.5}px) translateY(${yAxis * 1.5}px)`;
        }

        // Foreground Content Parallax (Slightly slower)
        if (heroContent) {
            heroContent.style.transform = `translateX(${xAxis * 0.5}px) translateY(${yAxis * 0.5}px)`;
        }
    });

    console.log("Axis Engine: 2D Perspective mode activated. Camera error bypassed.");
});
