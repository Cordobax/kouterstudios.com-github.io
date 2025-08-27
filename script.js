// Menú móvil
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    body.style.overflow = navLinks.classList.contains('show') ? 'hidden' : '';
});

// Cerrar menú al hacer clic en enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        body.style.overflow = '';
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Sistema de animaciones con Intersection Observer
function initAnimations() {
    const animatedElements = document.querySelectorAll('.reveal, .service-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Delay progresivo para evitar superposición
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 150); // 150ms entre cada elemento
                
                // Dejar de observar después de animar
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar todos los elementos animables
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Efecto de máquina de escribir para el hero
function typeWriter() {
    const title = document.querySelector('.hero h1');
    if (title) {
        const originalText = title.textContent;
        title.textContent = '';
        title.style.borderRight = '3px solid var(--secondary)';
        
        let i = 0;
        function type() {
            if (i < originalText.length) {
                title.textContent += originalText.charAt(i);
                i++;
                setTimeout(type, 100);
            } else {
                title.style.borderRight = 'none';
            }
        }
        type();
    }
}

// Inicializar cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    // Prevenir flash de contenido sin estilo
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    typeWriter();
    initAnimations();
});

// Re-inicializar animaciones al redimensionar
window.addEventListener('resize', () => {
    initAnimations();
});