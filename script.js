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
});// ===== SISTEMA DE AUTENTICACIÓN Y DESCUENTOS =====

// Elementos modales
const registerModal = document.getElementById('registerModal');
const loginModal = document.getElementById('loginModal');
const discountModal = document.getElementById('discountModal');
const closeButtons = document.querySelectorAll('.close-modal');

// Botones de toggle
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');

// Formularios
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

// ===== FUNCIONES DE MODALES =====
function showRegisterModal() {
    registerModal.style.display = 'block';
    loginModal.style.display = 'none';
}

function showLoginModal() {
    loginModal.style.display = 'block';
    registerModal.style.display = 'none';
}

function showDiscountModal() {
    discountModal.style.display = 'block';
    generateDiscountCode();
}

function closeModals() {
    registerModal.style.display = 'none';
    loginModal.style.display = 'none';
    discountModal.style.display = 'none';
}

// ===== EVENT LISTENERS =====
closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModals);
});

if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterModal();
    });
}

if (showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginModal();
    });
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target === registerModal) closeModals();
    if (e.target === loginModal) closeModals();
    if (e.target === discountModal) closeModals();
});

// ===== SISTEMA DE REGISTRO =====
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    // Validación simple
    if (!name || !email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    // Verificar si ya existe el usuario
    const existingUsers = JSON.parse(localStorage.getItem('kouterUsers') || '[]');
    const userExists = existingUsers.find(user => user.email === email);
    
    if (userExists) {
        alert('Este email ya está registrado');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // En producción, esto debería estar encriptado
        firstTime: true,
        discountUsed: false,
        createdAt: new Date().toISOString()
    };
    
    // Guardar usuario
    existingUsers.push(newUser);
    localStorage.setItem('kouterUsers', JSON.stringify(existingUsers));
    
    // Guardar sesión actual
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Mostrar descuento
    closeModals();
    showDiscountModal();
    
    // Actualizar interfaz
    updateAuthUI();
});

// ===== SISTEMA DE LOGIN =====
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const existingUsers = JSON.parse(localStorage.getItem('kouterUsers') || '[]');
    const user = existingUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Iniciar sesión
        localStorage.setItem('currentUser', JSON.stringify(user));
        closeModals();
        alert(`¡Bienvenido de vuelta, ${user.name}!`);
        updateAuthUI();
    } else {
        alert('Credenciales incorrectas');
    }
});

// ===== GENERAR CÓDIGO DE DESCUENTO =====
function generateDiscountCode() {
    const code = 'KOUTER20-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    document.getElementById('discountCode').textContent = code;
    
    // Guardar código en localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
        let discounts = JSON.parse(localStorage.getItem('userDiscounts') || '{}');
        discounts[currentUser.id] = {
            code: code,
            discount: 20,
            used: false,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem('userDiscounts', JSON.stringify(discounts));
    }
    
    return code;
}

// ===== COPIAR CÓDIGO =====
function copyDiscountCode() {
    const code = document.getElementById('discountCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('¡Código copiado al portapapeles!');
    }).catch(() => {
        alert('No se pudo copiar el código');
    });
}

// ===== ACTUALIZAR UI SEGÚN AUTENTICACIÓN =====
function updateAuthUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const floatingBtn = document.querySelector('.floating-btn');
    
    if (currentUser) {
        floatingBtn.innerHTML = '<i class="fas fa-user"></i><span>Mi Cuenta</span>';
        floatingBtn.onclick = () => {
            alert(`Hola ${currentUser.name}!`);
        };
    } else {
        floatingBtn.innerHTML = '<i class="fas fa-user-plus"></i><span>Obtener Descuento</span>';
        floatingBtn.onclick = showRegisterModal;
    }
}

// ===== VERIFICAR PRIMERA VISITA =====
function checkFirstVisit() {
    const hasVisited = localStorage.getItem('hasVisited');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!hasVisited && !currentUser) {
        // Esperar 3 segundos antes de mostrar el modal
        setTimeout(() => {
            showRegisterModal();
        }, 3000);
        
        localStorage.setItem('hasVisited', 'true');
    }
}

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    checkFirstVisit();
    
    // También puedes agregar esto al existing code
    typeWriter();
    initAnimations();
    initLazyLoading();
});
// ===== CONFIGURACIÓN EMAILJS =====
const EMAILJS_CONFIG = {
    SERVICE_ID: "TU_SERVICE_ID",
    TEMPLATE_ID: "TU_TEMPLATE_ID", 
    USER_ID: "TU_USER_ID_DE_EMAILJS"
};

// ===== FUNCIÓN PARA ENVIAR EMAIL =====
async function sendRegistrationEmail(userData) {
    try {
        const templateParams = {
            to_email: "tu-email@kouterstudios.com", // Tu email donde recibirás los registros
            from_name: userData.name,
            from_email: userData.email,
            name: userData.name,
            email: userData.email,
            discount_code: userData.discountCode,
            date: new Date().toLocaleDateString('es-ES'),
            time: new Date().toLocaleTimeString('es-ES'),
            subject: `Nuevo Registro - ${userData.name}`
        };

        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams,
            EMAILJS_CONFIG.USER_ID
        );

        console.log('Email enviado exitosamente!', response);
        return true;

    } catch (error) {
        console.error('Error enviando email:', error);
        return false;
    }
}

// ===== FUNCIÓN DE REGISTRO ACTUALIZADA =====
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    // Validación básica
    if (!name || !email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }

    // Generar código de descuento
    const discountCode = 'KOUTER20-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Guardar en localStorage
    const users = JSON.parse(localStorage.getItem('kouterUsers') || '[]');
    const userExists = users.find(user => user.email === email);
    
    if (userExists) {
        alert('Este email ya está registrado');
        return;
    }

    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: btoa(password), // Encriptación básica
        discountCode: discountCode,
        registeredAt: new Date().toISOString(),
        discountUsed: false
    };

    users.push(newUser);
    localStorage.setItem('kouterUsers', JSON.stringify(users));
    
    // Enviar email con EmailJS
    const emailSent = await sendRegistrationEmail(newUser);
    
    if (emailSent) {
        // Mostrar éxito
        closeModals();
        showDiscountModal(discountCode);
        
        // Opcional: enviar email al usuario también
        sendWelcomeEmailToUser(newUser);
        
    } else {
        alert('Registro completado, pero hubo un error enviando el email de confirmación.');
        closeModals();
        showDiscountModal(discountCode);
    }
});

// ===== ENVIAR EMAIL DE BIENVENIDA AL USUARIO =====
async function sendWelcomeEmailToUser(userData) {
    try {
        const templateParams = {
            to_email: userData.email,
            to_name: userData.name,
            from_name: "Kouter Studios",
            subject: "¡Bienvenido a Kouter Studios! - Tu código de descuento",
            welcome_message: `Hola ${userData.name}, gracias por registrarte.`,
            discount_code: userData.discountCode,
            discount_percent: "20%",
            valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')
        };

        await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            'TU_TEMPLATE_ID_BIENVENIDA', // Crea otro template para bienvenida
            templateParams,
            EMAILJS_CONFIG.USER_ID
        );

    } catch (error) {
        console.error('Error enviando email de bienvenida:', error);
    }
}

// ===== VERIFICAR CÓDIGO DE DESCUENTO =====
function verifyDiscountCode(code) {
    const users = JSON.parse(localStorage.getItem('kouterUsers') || '[]');
    const userWithDiscount = users.find(user => user.discountCode === code);
    
    if (!userWithDiscount) {
        return { valid: false, message: "Código no válido" };
    }
    
    if (userWithDiscount.discountUsed) {
        return { valid: false, message: "Código ya utilizado" };
    }
    
    return { 
        valid: true, 
        message: "Descuento aplicado", 
        discountPercent: 20,
        userEmail: userWithDiscount.email 
    };
}

// ===== APLICAR DESCUENTO ACTUALIZADO =====
function applyDiscount() {
    const discountCode = document.getElementById('discountInput').value;
    const verification = verifyDiscountCode(discountCode);
    
    if (verification.valid) {
        currentDiscount = {
            code: discountCode,
            discountPercent: verification.discountPercent,
            userEmail: verification.userEmail
        };
        
        updateCartUI();
        alert(`¡Descuento del ${verification.discountPercent}% aplicado!`);
        
        // Marcar como usado
        const users = JSON.parse(localStorage.getItem('kouterUsers') || '[]');
        const userIndex = users.findIndex(user => user.discountCode === discountCode);
        if (userIndex !== -1) {
            users[userIndex].discountUsed = true;
            localStorage.setItem('kouterUsers', JSON.stringify(users));
        }
        
    } else {
        alert(verification.message);
    }
}