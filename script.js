// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const typingText = document.querySelector('.typing-text');
const loadingScreen = document.getElementById('loading-screen');
const canvas = document.getElementById('rnnCanvas');
const ctx = canvas.getContext('2d');
const simCanvas = document.getElementById('simulationCanvas');
const simCtx = simCanvas.getContext('2d');
const particlesContainer = document.getElementById('particles');
const neuralBg = document.getElementById('neural-bg');

// Global Variables
let mouseX = 0;
let mouseY = 0;
let rnnViz = null;
let simulationViz = null;
let animationSpeed = 1;

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
    
    initializeParticles();
    initializeNeuralBackground();
    initializeTypingEffect();
    initializeRNNVisualization();
    initializeSimulation();
});

// Efek Ketikan
function initializeTypingEffect() {
    const text = "Visualisasi Jaringan RNN";
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            typingText.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 2500);
}

// Particle System
function initializeParticles() {
    for (let i = 0; i < 50; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    particlesContainer.appendChild(particle);
    
    // Remove particle after animation and create new one
    particle.addEventListener('animationiteration', () => {
        particle.style.left = Math.random() * 100 + '%';
    });
}

// Neural Network Background
function initializeNeuralBackground() {
    const svg = neuralBg;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Create neural network lines
    for (let i = 0; i < 20; i++) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const x1 = Math.random() * width;
        const y1 = Math.random() * height;
        const x2 = Math.random() * width;
        const y2 = Math.random() * height;
        
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#00d4ff');
        line.setAttribute('stroke-width', '0.5');
        line.setAttribute('opacity', '0.3');
        line.style.animation = `pulse ${3 + Math.random() * 4}s ease-in-out infinite`;
        
        svg.appendChild(line);
    }
    
    // Create nodes
    for (let i = 0; i < 15; i++) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const cx = Math.random() * width;
        const cy = Math.random() * height;
        
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', '#00ffff');
        circle.setAttribute('opacity', '0.6');
        circle.style.animation = `pulse ${2 + Math.random() * 3}s ease-in-out infinite`;
        
        svg.appendChild(circle);
    }
}

// Mouse Parallax Effect
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    const heroContent = document.querySelector('.hero-content');
    const neuralBg = document.querySelector('.neural-network-bg');
    const particles = document.querySelector('.particles-container');
    
    if (heroContent) {
        const x = (mouseX - window.innerWidth / 2) * 0.02;
        const y = (mouseY - window.innerHeight / 2) * 0.02;
        heroContent.style.transform = `translate(${x}px, ${y}px)`;
    }
    
    if (neuralBg) {
        const x = (mouseX - window.innerWidth / 2) * 0.05;
        const y = (mouseY - window.innerHeight / 2) * 0.05;
        neuralBg.style.transform = `translate(${x}px, ${y}px)`;
    }
    
    if (particles) {
        const x = (mouseX - window.innerWidth / 2) * 0.03;
        const y = (mouseY - window.innerHeight / 2) * 0.03;
        particles.style.transform = `translate(${x}px, ${y}px)`;
    }
});

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 31, 0.95)';
        navbar.style.boxShadow = '0 5px 30px rgba(0, 212, 255, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 31, 0.8)';
        navbar.style.boxShadow = 'none';
    }
});

// Scroll Reveal Animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);

// Add reveal class to elements
document.addEventListener('DOMContentLoaded', () => {
    const elementsToReveal = document.querySelectorAll('.about-card, .timeline-item, .feature-card');
    elementsToReveal.forEach(element => {
        element.classList.add('reveal');
    });
    reveal();
});

// Enhanced RNN Visualization Class
class EnhancedRNNVisualization {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        this.time = 0;
        this.dataFlow = [];
        this.speed = 1;
        
        this.setupCanvas();
        this.createNetwork();
        this.animate();
    }
    
    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = Math.min(900, rect.width - 40);
        this.canvas.height = 450;
    }
    
    createNetwork() {
        const nodeRadius = 30;
        const layerSpacing = this.canvas.width / 4;
        const nodeSpacing = 100;
        
        // Input layer
        for (let i = 0; i < 3; i++) {
            this.nodes.push({
                x: layerSpacing,
                y: this.canvas.height / 2 + (i - 1) * nodeSpacing,
                radius: nodeRadius,
                type: 'input',
                activation: 0,
                targetActivation: 0,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
        
        // Hidden layer
        for (let i = 0; i < 5; i++) {
            this.nodes.push({
                x: layerSpacing * 2,
                y: this.canvas.height / 2 + (i - 2) * nodeSpacing * 0.8,
                radius: nodeRadius,
                type: 'hidden',
                activation: 0,
                targetActivation: 0,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
        
        // Output layer
        for (let i = 0; i < 2; i++) {
            this.nodes.push({
                x: layerSpacing * 3,
                y: this.canvas.height / 2 + (i - 0.5) * nodeSpacing,
                radius: nodeRadius,
                type: 'output',
                activation: 0,
                targetActivation: 0,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
        
        this.createConnections();
    }
    
    createConnections() {
        const inputNodes = this.nodes.filter(n => n.type === 'input');
        const hiddenNodes = this.nodes.filter(n => n.type === 'hidden');
        const outputNodes = this.nodes.filter(n => n.type === 'output');
        
        // Input to hidden connections
        inputNodes.forEach(input => {
            hiddenNodes.forEach(hidden => {
                this.connections.push({
                    from: input,
                    to: hidden,
                    weight: Math.random() * 0.5 + 0.5,
                    flow: 0,
                    particles: []
                });
            });
        });
        
        // Hidden to hidden connections (recurrent)
        hiddenNodes.forEach((hidden1, i) => {
            hiddenNodes.forEach((hidden2, j) => {
                if (i !== j && Math.random() > 0.5) {
                    this.connections.push({
                        from: hidden1,
                        to: hidden2,
                        weight: Math.random() * 0.3 + 0.3,
                        flow: 0,
                        recurrent: true,
                        particles: []
                    });
                }
            });
        });
        
        // Hidden to output connections
        hiddenNodes.forEach(hidden => {
            outputNodes.forEach(output => {
                this.connections.push({
                    from: hidden,
                    to: output,
                    weight: Math.random() * 0.5 + 0.5,
                    flow: 0,
                    particles: []
                });
            });
        });
    }
    
    drawNode(node) {
        const { x, y, radius, type, activation, pulsePhase } = node;
        
        // Pulsing effect
        const pulseScale = 1 + Math.sin(this.time * 0.02 + pulsePhase) * 0.1;
        const currentRadius = radius * pulseScale;
        
        // Node glow effect
        const glowIntensity = activation;
        const glowRadius = currentRadius + glowIntensity * 20;
        
        // Outer glow
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
        const baseColor = type === 'input' ? '0, 212, 255' : 
                         type === 'hidden' ? '168, 85, 247' : '0, 153, 255';
        
        gradient.addColorStop(0, `rgba(${baseColor}, ${0.3 + glowIntensity * 0.4})`);
        gradient.addColorStop(0.5, `rgba(${baseColor}, ${0.1 + glowIntensity * 0.2})`);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - glowRadius, y - glowRadius, glowRadius * 2, glowRadius * 2);
        
        // Main node circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
        
        // Node gradient fill
        const nodeGradient = this.ctx.createRadialGradient(x, y, 0, x, y, currentRadius);
        nodeGradient.addColorStop(0, `rgba(${baseColor}, ${0.9 + activation * 0.1})`);
        nodeGradient.addColorStop(0.7, `rgba(${baseColor}, ${0.4 + activation * 0.3})`);
        nodeGradient.addColorStop(1, `rgba(${baseColor}, ${0.2 + activation * 0.2})`);
        
        this.ctx.fillStyle = nodeGradient;
        this.ctx.fill();
        
        // Node border
        this.ctx.strokeStyle = `rgba(${baseColor}, ${0.8 + activation * 0.2})`;
        this.ctx.lineWidth = 2 + activation * 2;
        this.ctx.stroke();
        
        // Inner glow
        if (activation > 0.1) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, currentRadius * 0.3, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${activation * 0.8})`;
            this.ctx.fill();
        }
        
        // Node label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        const label = type.charAt(0).toUpperCase() + type.slice(1);
        this.ctx.fillText(label, x, y + currentRadius + 20);
    }
    
    drawConnection(connection) {
        const { from, to, weight, flow, recurrent, particles } = connection;
        
        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        
        if (recurrent) {
            // Curved connection for recurrent
            const cp1x = from.x + (to.x - from.x) * 0.3;
            const cp1y = from.y - 80;
            const cp2x = from.x + (to.x - from.x) * 0.7;
            const cp2y = to.y - 80;
            this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, to.x, to.y);
        } else {
            // Straight connection
            this.ctx.lineTo(to.x, to.y);
        }
        
        // Connection color based on weight and flow
        const alpha = 0.2 + Math.abs(weight) * 0.3 + flow * 0.5;
        this.ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
        this.ctx.lineWidth = 1 + Math.abs(weight) * 2 + flow * 3;
        this.ctx.stroke();
        
        // Draw data flow particles
        particles.forEach((particle, index) => {
            if (particle.active) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, 3 + flow * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
                this.ctx.fill();
                
                // Particle glow
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, 6 + flow * 3, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity * 0.3})`;
                this.ctx.fill();
            }
        });
    }
    
    updateAnimation() {
        this.time += this.speed;
        
        // Simulate data flow
        if (this.time % (60 / this.speed) === 0) {
            // Activate random input nodes
            this.nodes.filter(n => n.type === 'input').forEach(node => {
                if (Math.random() > 0.7) {
                    node.targetActivation = Math.random() * 0.8 + 0.2;
                }
            });
        }
        
        // Smooth activation transitions
        this.nodes.forEach(node => {
            node.activation += (node.targetActivation - node.activation) * 0.1 * this.speed;
            node.targetActivation *= 0.98; // Decay
        });
        
        // Update connections and particles
        this.connections.forEach(connection => {
            connection.flow = connection.from.activation * Math.abs(connection.weight);
            
            // Update particles
            connection.particles.forEach(particle => {
                if (particle.active) {
                    particle.progress += 0.02 * this.speed;
                    
                    if (connection.recurrent) {
                        // Bezier curve for recurrent connections
                        const t = particle.progress;
                        const cp1x = connection.from.x + (connection.to.x - connection.from.x) * 0.3;
                        const cp1y = connection.from.y - 80;
                        const cp2x = connection.from.x + (connection.to.x - connection.from.x) * 0.7;
                        const cp2y = connection.to.y - 80;
                        
                        particle.x = Math.pow(1-t, 3) * connection.from.x + 
                                    3 * Math.pow(1-t, 2) * t * cp1x + 
                                    3 * (1-t) * Math.pow(t, 2) * cp2x + 
                                    Math.pow(t, 3) * connection.to.x;
                        particle.y = Math.pow(1-t, 3) * connection.from.y + 
                                    3 * Math.pow(1-t, 2) * t * cp1y + 
                                    3 * (1-t) * Math.pow(t, 2) * cp2y + 
                                    Math.pow(t, 3) * connection.to.y;
                    } else {
                        // Linear interpolation for straight connections
                        particle.x = connection.from.x + (connection.to.x - connection.from.x) * particle.progress;
                        particle.y = connection.from.y + (connection.to.y - connection.from.y) * particle.progress;
                    }
                    
                    particle.opacity = Math.sin(particle.progress * Math.PI);
                    
                    if (particle.progress >= 1) {
                        particle.active = false;
                    }
                }
            });
            
            // Add new particles when there's flow
            if (connection.flow > 0.3 && this.time % 10 === 0) {
                const inactiveParticle = connection.particles.find(p => !p.active);
                if (inactiveParticle) {
                    inactiveParticle.active = true;
                    inactiveParticle.progress = 0;
                    inactiveParticle.x = connection.from.x;
                    inactiveParticle.y = connection.from.y;
                    inactiveParticle.opacity = 1;
                }
            }
        });
        
        // Activate hidden and output nodes based on connections
        this.nodes.filter(n => n.type === 'hidden' || n.type === 'output').forEach(node => {
            const inputSum = this.connections
                .filter(c => c.to === node)
                .reduce((sum, c) => sum + c.from.activation * c.weight, 0);
            
            if (Math.abs(inputSum) > 0.2) {
                node.targetActivation = Math.min(1, Math.abs(inputSum) * 0.8);
            }
        });
    }
    
    draw() {
        // Clear canvas with trail effect
        this.ctx.fillStyle = 'rgba(26, 26, 62, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(connection => {
            this.drawConnection(connection);
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            this.drawNode(node);
        });
        
        // Draw title
        this.ctx.fillStyle = '#00d4ff';
        this.ctx.font = 'bold 18px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Jaringan RNN Canggih', this.canvas.width / 2, 30);
    }
    
    animate() {
        this.updateAnimation();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    reset() {
        this.nodes.forEach(node => {
            node.activation = 0;
            node.targetActivation = 0;
        });
        this.connections.forEach(connection => {
            connection.flow = 0;
            connection.particles.forEach(particle => {
                particle.active = false;
            });
        });
        this.time = 0;
    }
    
    setSpeed(speed) {
        this.speed = speed;
    }
}

// Initialize RNN Visualization
function initializeRNNVisualization() {
    if (canvas) {
        rnnViz = new EnhancedRNNVisualization(canvas);
        
        // Initialize particles for each connection
        rnnViz.connections.forEach(connection => {
            for (let i = 0; i < 3; i++) {
                connection.particles.push({
                    active: false,
                    progress: 0,
                    x: connection.from.x,
                    y: connection.from.y,
                    opacity: 1
                });
            }
        });
    }
}

// Live Simulation Class
class LiveRNNSimulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.currentChar = 0;
        this.isProcessing = false;
        
        this.setupCanvas();
        this.createSimulationNetwork();
        this.draw();
    }
    
    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width - 50;
        this.canvas.height = 300;
    }
    
    createSimulationNetwork() {
        const nodeRadius = 20;
        const y = this.canvas.height / 2;
        const spacing = this.canvas.width / 8;
        
        // Create nodes for simulation
        for (let i = 0; i < 5; i++) {
            this.nodes.push({
                x: spacing + i * spacing,
                y: y,
                radius: nodeRadius,
                activation: 0,
                targetActivation: 0,
                label: i === 0 ? 'Input' : i === 4 ? 'Output' : `H${i}`
            });
        }
    }
    
    processText(text) {
        if (!text || this.isProcessing) return;
        
        this.isProcessing = true;
        this.currentChar = 0;
        
        const chars = text.split('');
        this.processSequence(chars);
    }
    
    async processSequence(chars) {
        for (let i = 0; i < chars.length; i++) {
            await this.processChar(chars[i], i);
            await this.delay(300);
        }
        
        // Final prediction
        await this.generatePrediction();
        this.isProcessing = false;
    }
    
    async processChar(char, index) {
        // Activate input node
        this.nodes[0].targetActivation = 1;
        
        // Propagate through hidden nodes
        for (let i = 1; i < 4; i++) {
            await this.delay(100);
            this.nodes[i].targetActivation = 0.8;
            this.nodes[i - 1].targetActivation = 0.3;
        }
        
        // Activate output
        await this.delay(100);
        this.nodes[4].targetActivation = 0.6;
        
        // Decay
        await this.delay(100);
        this.nodes.forEach(node => {
            node.targetActivation = 0;
        });
    }
    
    async generatePrediction() {
        const predictions = ['berikutnya', 'kata', 'teks', 'data', 'urutan'];
        const prediction = predictions[Math.floor(Math.random() * predictions.length)];
        
        document.getElementById('predictionResult').textContent = `Prediksi: "${prediction}"`;
        document.getElementById('predictionResult').style.animation = 'pulse 0.5s ease';
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(26, 26, 62, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        for (let i = 0; i < this.nodes.length - 1; i++) {
            const from = this.nodes[i];
            const to = this.nodes[i + 1];
            
            this.ctx.beginPath();
            this.ctx.moveTo(from.x, from.y);
            this.ctx.lineTo(to.x, to.y);
            
            const flow = Math.max(from.activation, to.activation);
            this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 + flow * 0.5})`;
            this.ctx.lineWidth = 2 + flow * 3;
            this.ctx.stroke();
        }
        
        // Draw nodes
        this.nodes.forEach(node => {
            node.activation += (node.targetActivation - node.activation) * 0.1;
            
            const { x, y, radius, activation, label } = node;
            
            // Node glow
            if (activation > 0.1) {
                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
                gradient.addColorStop(0, `rgba(168, 85, 247, ${activation * 0.5})`);
                gradient.addColorStop(1, 'transparent');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x - radius * 2, y - radius * 2, radius * 4, radius * 4);
            }
            
            // Node circle
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            
            const nodeGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            nodeGradient.addColorStop(0, `rgba(168, 85, 247, ${0.9 + activation * 0.1})`);
            nodeGradient.addColorStop(1, `rgba(168, 85, 247, ${0.3 + activation * 0.4})`);
            
            this.ctx.fillStyle = nodeGradient;
            this.ctx.fill();
            
            this.ctx.strokeStyle = `rgba(168, 85, 247, ${0.8 + activation * 0.2})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '10px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, x, y + radius + 15);
        });
        
        requestAnimationFrame(() => this.draw());
    }
}

// Initialize Simulation
function initializeSimulation() {
    if (simCanvas) {
        simulationViz = new LiveRNNSimulation(simCanvas);
    }
}

// Control functions
function mulaiAnimasi() {
    if (rnnViz) {
        rnnViz.start();
    }
}

function resetAnimasi() {
    if (rnnViz) {
        rnnViz.reset();
    }
}

function ubahKecepatan() {
    if (rnnViz) {
        animationSpeed = animationSpeed === 1 ? 2 : animationSpeed === 2 ? 0.5 : 1;
        rnnViz.setSpeed(animationSpeed);
    }
}

// Jalankan simulasi
function jalankanSimulasi() {
    const input = document.getElementById('textInput').value;
    if (!input) return;
    
    // Tampilkan urutan
    const sequenceDiv = document.getElementById('sequenceChars');
    sequenceDiv.innerHTML = '';
    
    input.split('').forEach((char, index) => {
        setTimeout(() => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = char;
            charSpan.style.animationDelay = '0s';
            sequenceDiv.appendChild(charSpan);
        }, index * 100);
    });
    
    // Jalankan simulasi
    if (simulationViz) {
        simulationViz.processText(input);
    }
}

// Enhanced interactive effects
document.querySelectorAll('.about-card, .feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Enhanced parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroBg && heroContent) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - scrolled / 700;
    }
});

// Smooth reveal for timeline items
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(50px)';
    item.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    observer.observe(item);
});

// Enhanced floating animations
document.querySelectorAll('.feature-icon > div').forEach((icon, index) => {
    icon.style.animationDelay = `${index * 0.3}s`;
    icon.style.animationDuration = `${4 + index * 0.5}s`;
});

// Enhanced button effects
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.6)';
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
        this.style.transform = '';
    });
});

// Performance optimization
let ticking = false;
function updateOnScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            reveal();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Window resize handler
window.addEventListener('resize', () => {
    if (rnnViz) {
        rnnViz.setupCanvas();
        rnnViz.nodes = [];
        rnnViz.connections = [];
        rnnViz.createNetwork();
    }
    
    if (simulationViz) {
        simulationViz.setupCanvas();
    }
});

// Touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndY < touchStartY - 50) {
        // Swipe up
        console.log('Swiped up');
    }
    if (touchEndY > touchStartY + 50) {
        // Swipe down
        console.log('Swiped down');
    }
}

// Add enter key support for simulation input
document.getElementById('textInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        jalankanSimulasi();
    }
});
