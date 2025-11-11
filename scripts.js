/* Archivo: scripts.js - CORREGIDO con Validación de Teléfono */

// =======================================================
// 1. CONFIGURACIÓN DEL FORMULARIO Y VALIDACIÓN
// =======================================================

const GOOGLE_SCRIPT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx8yPloexKjU6mEXyJR5YxgAoMKdvYrekWVxtm1aGqHOAHxg3IjnIGRJAkiKfoCR2XUUg/exec'; 

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------
    // Elementos del DOM
    // ------------------------------------
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitButton = form ? form.querySelector('.submit-btn') : null;
    const telefonoInput = document.getElementById('telefono'); // Nuevo ID añadido al HTML
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
    // Lógica de Validación Específica del Teléfono
    // ------------------------------------
    if (telefonoInput) {
        telefonoInput.addEventListener('input', (e) => {
            let value = e.target.value;
            
            // 1. Permite solo números y '+'
            value = value.replace(/[^0-9+]/g, '');

            // 2. Si empieza con '+', asegura que solo haya uno al inicio
            if (value.startsWith('+')) {
                // Mantiene el primer '+' y elimina cualquier otro '+' subsiguiente
                value = '+' + value.substring(1).replace(/\+/g, '');
            } else {
                 // Si el usuario no puso '+' al inicio, solo deja dígitos
                 value = value.replace(/\+/g, '');
            }
            
            e.target.value = value;
        });
    }


    // ------------------------------------
    // Envío del Formulario
    // ------------------------------------
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Re-validación del formato aquí (aunque HTML pattern ayuda)
            if (telefonoInput && !telefonoInput.checkValidity()) {
                formMessage.textContent = 'Por favor, revise el formato del teléfono.';
                formMessage.classList.add('error');
                setTimeout(() => formMessage.classList.remove('error'), 3000);
                return; // Detener el envío si el patrón no se cumple
            }

            // Estado de envío
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            formMessage.textContent = '';
            formMessage.className = 'form-message'; 

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(GOOGLE_SCRIPT_ENDPOINT, {
                    method: 'POST',
                    mode: 'no-cors', 
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(data).toString()
                });

                formMessage.textContent = '¡Mensaje enviado con éxito! Le contactaremos pronto.';
                formMessage.classList.add('success');
                form.reset(); 

            } catch (error) {
                console.error('Error de red o CORS al enviar el formulario:', error);
                formMessage.textContent = 'Hubo un error de conexión. Por favor, intente de nuevo o use el correo.';
                formMessage.classList.add('error');
            } finally {
                setTimeout(() => {
                    submitButton.textContent = 'Enviar Solicitud';
                    submitButton.disabled = false;
                    setTimeout(() => {
                         formMessage.classList.remove('success', 'error');
                         formMessage.textContent = '';
                    }, 3000);
                }, 500);
            }
        });
    }

    // =======================================================
    // 3. LÓGICA DEL CARRUSEL DE VALOR DIFERENCIAL 
    // =======================================================
    const slides = document.querySelectorAll('.value-carousel-container .carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
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