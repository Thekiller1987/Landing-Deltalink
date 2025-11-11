/* Archivo: scripts.js (Landing Page) - CON VALIDACIÓN DE TELÉFONO MEJORADA */

// =======================================================
// 1. CONFIGURACIÓN DEL FORMULARIO Y API UNIFICADA
// =======================================================
const GOOGLE_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx8yPloexKjU6mEXyJR5YxgAoMKdvYrekWVxtm1aGqHOAHxg3IjnIGRJAkiKfoCR2XUUg/exec'; 

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // Elementos del DOM
    // ------------------------------------
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitButton = form ? form.querySelector('.submit-btn') : null;
    const telefonoInput = document.getElementById('telefono');
    const mainNav = document.querySelector('nav');
    const hamburgerBtn = document.querySelector('.hamburger-menu');

    // ------------------------------------
    // Funcionalidad del Menú Hamburguesa
    // ------------------------------------
    function closeMobileMenu() {
        if (mainNav && hamburgerBtn) {
            mainNav.classList.remove('active');
            hamburgerBtn.classList.remove('active');
        }
    }

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
        });
        
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // ------------------------------------
    // Lógica de Validación Específica del Teléfono (NUEVA MÁSCARA)
    // ------------------------------------
    if (telefonoInput) {
        telefonoInput.addEventListener('input', (e) => {
            let input = e.target;
            let value = input.value;

            // 1. Limpiar el input de todo excepto números y un '+' al inicio
            let cleaned = value.replace(/[^0-9+]/g, '');
            if (cleaned.startsWith('+')) {
                // Si empieza con '+', quitar todos los '+' adicionales
                cleaned = '+' + cleaned.substring(1).replace(/\+/g, '');
            } else {
                // Si no empieza con '+', quitar todos los '+'
                cleaned = cleaned.replace(/\+/g, '');
            }

            let formatted = '';
            
            // 2. Aplicar formato +505 (Añade el espacio)
            if (cleaned.startsWith('+505')) {
                formatted = '+505';
                if (cleaned.length > 4) {
                    // Añadir espacio y limitar a 8 dígitos después
                    formatted += ' ' + cleaned.substring(4, 12);
                }
            } 
            // 3. Manejar números locales (8 dígitos)
            else if (!cleaned.startsWith('+') && cleaned.length > 0) {
                formatted = cleaned.substring(0, 8); // Limitar a 8 dígitos
            } 
            // 4. Manejar otros códigos internacionales
            else {
                formatted = cleaned.substring(0, 16); // Límite genérico
            }

            input.value = formatted;
        });
    }


    // ------------------------------------
    // Envío del Formulario
    // ------------------------------------
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 3. Validación final antes de enviar
            if (telefonoInput && !telefonoInput.checkValidity()) {
                // El 'title' del HTML se mostrará automáticamente
                // Pero añadimos un mensaje extra
                showMessage('form-message', 'Formato de teléfono inválido. Revise el campo.', 'error');
                return;
            }

            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            formMessage.textContent = '';
            formMessage.className = 'form-message'; 

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            data.action = 'submit_lead';

            try {
                const response = await fetch(GOOGLE_SCRIPT_ENDPOINT, {
                    method: 'POST',
                    mode: 'cors', 
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(data).toString()
                });

                const result = await response.json();

                if (result.success) {
                    showMessage('form-message', '¡Mensaje enviado con éxito! Le contactaremos pronto.', 'success');
                    form.reset(); 
                } else {
                    showMessage('form-message', result.message || 'Error al enviar el formulario.', 'error');
                }

            } catch (error) {
                console.error('Error de red o CORS al enviar el formulario:', error);
                showMessage('form-message', 'Hubo un error de conexión. Por favor, intente de nuevo o use el correo.', 'error');
            } finally {
                setTimeout(() => {
                    submitButton.textContent = 'Enviar Solicitud';
                    submitButton.disabled = false;
                }, 500);
            }
        });
    }

    // Función de utilidad para mensajes
    function showMessage(elementId, message, type) {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.textContent = message;
        el.className = `message-box ${type} visible`;
        el.style.display = 'block';
        
        setTimeout(() => {
            el.classList.remove('visible');
            setTimeout(() => el.style.display = 'none', 300);
        }, 5000);
    }

    // =======================================================
    // 3. LÓGICA DEL CARRUSEL DE VALOR DIFERENCIAL 
    // =======================================================
    const slides = document.querySelectorAll('.value-carousel-container .carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (slides.length === 0) return; 

        if (index >= slides.length) {
            index = 0;
        } else if (index < 0) {
            index = slides.length - 1;
        }

        slides.forEach((slide, i) => {
             slide.classList.remove('active');
             slide.style.transform = `translateX(${(i - index) * 100}%)`;
        });
        
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        slides[index].style.transform = `translateX(0)`;
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function startSlideShow() {
        clearInterval(slideInterval); 
        slideInterval = setInterval(nextSlide, 7000); 
    }
    
    if (slides.length > 0) {
        showSlide(0); 
        startSlideShow(); 

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-slide'));
                showSlide(index);
                startSlideShow(); 
            });
        });

        const carouselContainer = document.querySelector('.value-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
            carouselContainer.addEventListener('mouseleave', startSlideShow);
        }
    }


    // =======================================================
    // 4. EFECTO STICKY HEADER CON SOMBRA
    // =======================================================
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { 
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});