// Synaptic Constellation Interactive Behavior

class SynapticLogo {
    constructor() {
        this.svg = document.querySelector('#synapticLogo svg');
        this.nodes = this.svg.querySelectorAll('.node');
        this.synapses = this.svg.querySelectorAll('.synapse');
        this.dataFlows = this.svg.querySelectorAll('.data-flows circle');
        
        this.init();
    }
    
    init() {
        this.setupInteractivity();
        this.generateMiniLogos();
        this.createGeometryGrid();
        this.initializeDataFlow();
    }
    
    setupInteractivity() {
        // Node hover effects
        this.nodes.forEach((node, index) => {
            node.addEventListener('mouseenter', () => {
                this.activateNode(node, index);
            });
            
            node.addEventListener('mouseleave', () => {
                this.deactivateNode(node);
            });
        });
        
        // Synapse hover effects
        this.synapses.forEach(synapse => {
            synapse.addEventListener('mouseenter', () => {
                synapse.style.stroke = 'var(--sapphire)';
                synapse.style.strokeWidth = '3';
                synapse.style.opacity = '1';
                this.pulseAlongPath(synapse);
            });
            
            synapse.addEventListener('mouseleave', () => {
                synapse.style.stroke = 'var(--titanium)';
                synapse.style.strokeWidth = '1.5';
                synapse.style.opacity = '0.4';
            });
        });
    }
    
    activateNode(node, index) {
        // Enlarge and brighten the node
        node.style.transform = 'scale(1.3)';
        node.style.fill = 'var(--sapphire)';
        
        // Activate connected synapses
        const connectedSynapses = this.findConnectedSynapses(node);
        connectedSynapses.forEach(synapse => {
            synapse.style.stroke = 'var(--sapphire)';
            synapse.style.opacity = '0.8';
        });
        
        // Create ripple effect
        this.createRipple(node);
    }
    
    deactivateNode(node) {
        node.style.transform = 'scale(1)';
        node.style.fill = node.classList.contains('node-core') ? 'var(--sapphire-dim)' : 'var(--obsidian)';
        
        // Reset synapses
        this.synapses.forEach(synapse => {
            synapse.style.stroke = 'var(--titanium)';
            synapse.style.opacity = '0.4';
        });
    }
    
    findConnectedSynapses(node) {
        const nodeX = parseFloat(node.getAttribute('cx'));
        const nodeY = parseFloat(node.getAttribute('cy'));
        const connected = [];
        
        this.synapses.forEach(synapse => {
            const pathData = synapse.getAttribute('d');
            if (pathData.includes(`${nodeX} ${nodeY}`)) {
                connected.push(synapse);
            }
        });
        
        return connected;
    }
    
    createRipple(node) {
        const ripple = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const cx = node.getAttribute('cx');
        const cy = node.getAttribute('cy');
        
        ripple.setAttribute('cx', cx);
        ripple.setAttribute('cy', cy);
        ripple.setAttribute('r', '5');
        ripple.setAttribute('fill', 'none');
        ripple.setAttribute('stroke', 'var(--sapphire)');
        ripple.setAttribute('stroke-width', '2');
        ripple.setAttribute('opacity', '1');
        
        this.svg.appendChild(ripple);
        
        // Animate ripple
        let radius = 5;
        let opacity = 1;
        const animate = () => {
            radius += 3;
            opacity -= 0.02;
            
            ripple.setAttribute('r', radius);
            ripple.setAttribute('opacity', opacity);
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                ripple.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    pulseAlongPath(synapse) {
        const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pulse.setAttribute('r', '4');
        pulse.setAttribute('fill', 'var(--sapphire)');
        
        const animateMotion = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        animateMotion.setAttribute('dur', '1s');
        animateMotion.setAttribute('repeatCount', '1');
        
        const mpath = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');
        mpath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${synapse.id}`);
        
        animateMotion.appendChild(mpath);
        pulse.appendChild(animateMotion);
        this.svg.appendChild(pulse);
        
        setTimeout(() => pulse.remove(), 1000);
    }
    
    generateMiniLogos() {
        const miniSvgs = document.querySelectorAll('.state-svg');
        miniSvgs.forEach((svg, index) => {
            // Clone and simplify the main logo for each state
            const clone = this.svg.cloneNode(true);
            clone.removeAttribute('id');
            
            // Apply state-specific modifications
            if (svg.parentElement.classList.contains('resting')) {
                clone.querySelectorAll('.synapse').forEach(s => s.style.opacity = '0.2');
                clone.querySelectorAll('.data-flows').forEach(d => d.style.display = 'none');
            } else if (svg.parentElement.classList.contains('analyzing')) {
                clone.querySelectorAll('.data-flows circle').forEach(c => {
                    c.style.animationDuration = '1s';
                });
            } else if (svg.parentElement.classList.contains('insight')) {
                clone.querySelectorAll('.node').forEach(n => {
                    n.style.fill = 'var(--sapphire)';
                    n.style.stroke = 'var(--chrome)';
                });
            }
            
            svg.parentElement.replaceChild(clone, svg);
        });
    }
    
    createGeometryGrid() {
        const gridSvg = document.getElementById('geometryGrid');
        if (!gridSvg) return;
        
        // Create golden ratio spiral overlay
        const spiral = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const spiralPath = this.generateGoldenSpiral();
        spiral.setAttribute('d', spiralPath);
        spiral.setAttribute('fill', 'none');
        spiral.setAttribute('stroke', 'var(--sapphire)');
        spiral.setAttribute('stroke-width', '1');
        spiral.setAttribute('opacity', '0.3');
        
        // Create grid lines
        for (let i = 0; i <= 400; i += 50) {
            const lineH = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            lineH.setAttribute('x1', '0');
            lineH.setAttribute('y1', i);
            lineH.setAttribute('x2', '400');
            lineH.setAttribute('y2', i);
            lineH.setAttribute('stroke', 'var(--titanium)');
            lineH.setAttribute('stroke-width', '0.5');
            lineH.setAttribute('opacity', '0.1');
            
            const lineV = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            lineV.setAttribute('x1', i);
            lineV.setAttribute('y1', '0');
            lineV.setAttribute('x2', i);
            lineV.setAttribute('y2', '400');
            lineV.setAttribute('stroke', 'var(--titanium)');
            lineV.setAttribute('stroke-width', '0.5');
            lineV.setAttribute('opacity', '0.1');
            
            gridSvg.appendChild(lineH);
            gridSvg.appendChild(lineV);
        }
        
        gridSvg.appendChild(spiral);
        
        // Add the main logo structure on top
        const mainStructure = this.svg.cloneNode(true);
        mainStructure.style.opacity = '0.5';
        gridSvg.appendChild(mainStructure);
    }
    
    generateGoldenSpiral() {
        // Simplified golden spiral path
        return `M 200 200 
                Q 250 200, 250 150 
                Q 250 100, 200 100
                Q 150 100, 150 150
                Q 150 200, 200 200
                Q 300 200, 300 100
                Q 300 0, 200 0
                Q 100 0, 100 100
                Q 100 300, 300 300`;
    }
    
    initializeDataFlow() {
        // Create continuous data flow visualization
        setInterval(() => {
            if (Math.random() > 0.7) {
                const randomSynapse = this.synapses[Math.floor(Math.random() * this.synapses.length)];
                this.pulseAlongPath(randomSynapse);
            }
        }, 2000);
    }
}

// Neural particle system
class NeuralParticles {
    constructor() {
        this.particles = [];
        this.maxParticles = 30;
        this.init();
    }
    
    init() {
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 200);
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'neural-particle';
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: var(--sapphire);
            border-radius: 50%;
            pointer-events: none;
            opacity: ${Math.random() * 0.5 + 0.3};
            left: ${Math.random() * window.innerWidth}px;
            top: ${Math.random() * window.innerHeight}px;
            box-shadow: 0 0 ${Math.random() * 10 + 5}px var(--neural-glow);
        `;
        
        document.body.appendChild(particle);
        
        const trajectory = {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            element: particle,
            opacity: parseFloat(particle.style.opacity),
            connections: []
        };
        
        this.particles.push(trajectory);
    }
    
    animate() {
        this.particles.forEach((particle, index) => {
            const rect = particle.element.getBoundingClientRect();
            let newX = rect.left + particle.x;
            let newY = rect.top + particle.y;
            
            // Bounce off edges
            if (newX <= 0 || newX >= window.innerWidth) particle.x *= -1;
            if (newY <= 0 || newY >= window.innerHeight) particle.y *= -1;
            
            particle.element.style.left = `${newX}px`;
            particle.element.style.top = `${newY}px`;
            
            // Connect nearby particles
            this.particles.forEach((other, otherIndex) => {
                if (index !== otherIndex) {
                    const distance = this.getDistance(particle.element, other.element);
                    if (distance < 150) {
                        this.drawConnection(particle.element, other.element, distance);
                    }
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    getDistance(el1, el2) {
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        
        const dx = rect1.left - rect2.left;
        const dy = rect1.top - rect2.top;
        
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    drawConnection(el1, el2, distance) {
        const opacity = 1 - (distance / 150);
        const line = document.createElement('div');
        
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();
        
        const angle = Math.atan2(rect2.top - rect1.top, rect2.left - rect1.left);
        
        line.style.cssText = `
            position: fixed;
            height: 1px;
            background: var(--titanium);
            opacity: ${opacity * 0.3};
            left: ${rect1.left}px;
            top: ${rect1.top}px;
            width: ${distance}px;
            transform: rotate(${angle}rad);
            transform-origin: 0 0;
            pointer-events: none;
        `;
        
        document.body.appendChild(line);
        setTimeout(() => line.remove(), 100);
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    new SynapticLogo();
    new NeuralParticles();
    
    // Add parallax effect to header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
});