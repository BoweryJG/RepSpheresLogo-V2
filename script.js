// Add interactive hover effects to the main logo
const logoMark = document.getElementById('logoMark');
const orbits = logoMark.querySelectorAll('.orbit');
const dataCore = logoMark.querySelector('.data-core');

logoMark.addEventListener('mouseenter', () => {
    orbits.forEach((orbit, index) => {
        orbit.style.animationDuration = `${10 + index * 5}s`;
    });
    dataCore.style.transform = 'translate(-50%, -50%) scale(1.2)';
});

logoMark.addEventListener('mouseleave', () => {
    orbits.forEach((orbit, index) => {
        orbit.style.animationDuration = `${15 + index * 5}s`;
    });
    dataCore.style.transform = 'translate(-50%, -50%) scale(1)';
});

// Add smooth parallax effect to pattern on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const patternGrid = document.querySelector('.pattern-grid');
    if (patternGrid) {
        patternGrid.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Create dynamic background particles
function createParticle() {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '2px';
    particle.style.height = '2px';
    particle.style.background = 'var(--titanium)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.opacity = Math.random() * 0.5;
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    
    document.body.appendChild(particle);
    
    const duration = 10000 + Math.random() * 20000;
    particle.animate([
        { transform: 'translate(0, 0)', opacity: 0 },
        { transform: 'translate(0, -100px)', opacity: particle.style.opacity },
        { transform: 'translate(0, -200px)', opacity: 0 }
    ], {
        duration: duration,
        easing: 'ease-out'
    }).onfinish = () => particle.remove();
}

// Create particles periodically
setInterval(createParticle, 500);

// Add responsive logo scaling
function handleResize() {
    const vw = window.innerWidth;
    const logos = document.querySelectorAll('.orbital-sphere');
    
    logos.forEach(logo => {
        if (vw < 768 && !logo.classList.contains('small')) {
            logo.style.transform = 'scale(0.8)';
        } else {
            logo.style.transform = '';
        }
    });
}

window.addEventListener('resize', handleResize);
handleResize();