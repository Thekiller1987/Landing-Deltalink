/* Archivo: scripts.js (Landing Page DELTALINK) */

// 🌟 URL DE FORMULARIO DIRECTO (FormSubmit.co API) 🌟
const FORM_SUBMIT_ENDPOINT = 'https://formsubmit.co/ajax/Deltalink505@outlook.com';

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
    // Lógica de Formateo de Teléfono (+505 8XXX-XXXX)
    // ------------------------------------
    if (telefonoInput) {
        telefonoInput.addEventListener('input', (e) => {
            let digits = e.target.value.replace(/\D/g, ''); // Extraer solo dígitos
            
            // Si el usuario ingresa accidentalmente el prefijo del país al inicio, lo extraemos para dar el formato
            if (digits.startsWith('505') && digits.length > 3) {
                digits = digits.substring(3);
            }
            
            // Nicaragua usa números de 8 dígitos
            if (digits.length > 8) {
                digits = digits.substring(0, 8);
            }
            
            // Formatear dinámicamente como +505 XXXX-XXXX
            if (digits.length === 0) {
                e.target.value = '';
            } else if (digits.length <= 4) {
                e.target.value = `+505 ${digits}`;
            } else {
                e.target.value = `+505 ${digits.substring(0, 4)}-${digits.substring(4)}`;
            }
        });
    }

    // ------------------------------------
    // Envío del Formulario (Conexión con FormSubmit.co AJAX)
    // ------------------------------------
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validación básica del teléfono (debe tener el formato completo de 8 dígitos de Nicaragua)
            const cleanNumber = telefonoInput.value.replace(/\D/g, '');
            if (cleanNumber.length < 11) { // 505 (3) + 8 dígitos = 11
                formMessage.textContent = 'Por favor, ingrese un número de teléfono válido de 8 dígitos.';
                formMessage.className = 'form-message error';
                
                setTimeout(() => {
                   formMessage.textContent = '';
                   formMessage.classList.remove('error');
                }, 4000);
                return;
            }

            submitButton.textContent = 'Enviando Solicitud...';
            submitButton.disabled = true;
            formMessage.textContent = '';
            formMessage.className = 'form-message'; 

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Configuraciones de FormSubmit.co
            data._subject = 'Nuevo lead de DELTALINK';
            data._honey = ''; // Honeypot para evitar spam en FormSubmit
            
            try {
                const response = await fetch(FORM_SUBMIT_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success === 'true') {
                    formMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
                    formMessage.className = 'form-message success';
                    form.reset(); 
                } else {
                    formMessage.textContent = result.message || 'Error al enviar el formulario.';
                    formMessage.className = 'form-message error';
                }

            } catch (error) {
                console.error('Error de red al enviar el formulario:', error);
                formMessage.textContent = 'Hubo un error de conexión. Por favor, intente de nuevo o escríbanos por WhatsApp.';
                formMessage.className = 'form-message error';
            } finally {
                setTimeout(() => {
                    submitButton.textContent = 'Enviar Solicitud';
                    submitButton.disabled = false;
                    setTimeout(() => {
                         formMessage.classList.remove('success', 'error');
                         formMessage.textContent = '';
                    }, 4000); // Limpia el mensaje después de 4 segundos
                }, 500);
            }
        });
    }

    // =======================================================
    // 3. LÓGICA DEL CARRUSEL DE VALOR DIFERENCIAL 
    // =======================================================
    const slides = document.querySelectorAll('.value-carousel-container .carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
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

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlideShow() {
        clearInterval(slideInterval); 
        slideInterval = setInterval(nextSlide, 8000); // Cambia slide cada 8 segundos
    }
    
    if (slides.length > 0) {
        showSlide(0); 
        startSlideShow(); 

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-slide'));
                showSlide(index);
                startSlideShow(); // Reinicia el timer al hacer clic manual
            });
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startSlideShow();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startSlideShow();
            });
        }

        // Pausar al poner el mouse encima
        const carouselContainer = document.querySelector('.value-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
            carouselContainer.addEventListener('mouseleave', startSlideShow);
        }
    }

    // =======================================================
    // 4. LÓGICA DE PREGUNTAS FRECUENTES (FAQs)
    // =======================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Cierra los otros acordeones
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Si no estaba activo, lo abre
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // =======================================================
    // 5. EFECTO STICKY HEADER CON SOMBRA
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