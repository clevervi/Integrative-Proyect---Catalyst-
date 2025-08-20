// Funciones de UI y utilidades
import { updateFavoritesUI } from "./jobs.js";

// Inicializar todas las funciones de UI
export const initUIFunctions = () => {
    initAnimateElements();
    handleSubscription();
    window.addEventListener('scroll', animateOnScroll);
    updateFavoritesUI();
    initToastContainer();
};

// Crear contenedor para toasts si no existe
const initToastContainer = () => {
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1100';
        document.body.appendChild(toastContainer);
    }
};

// Muestra una notificación toast
export const showToast = (message, type = 'success') => {
    // Crear y mostrar toast
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : 'success'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    document.getElementById('toast-container').appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Eliminar el toast después de que se oculte
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
};

// Animación para los elementos al hacer scroll
const animateOnScroll = function () {
    const elements = document.querySelectorAll('.job-card, .company-card, .benefit-card');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementPosition < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Inicializar elementos con opacidad 0 para la animación
const initAnimateElements = function () {
    const elements = document.querySelectorAll('.job-card, .company-card, .benefit-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.5s ease';
    });
    // Disparar la animación inicial
    setTimeout(animateOnScroll, 100);
};

// Manejar el envío del formulario de suscripción
const handleSubscription = function () {
    const subscribeForms = document.querySelectorAll('footer form');
    subscribeForms.forEach(form => {
        const button = form.querySelector('button[type="submit"]');
        if (button) {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const emailInput = form.querySelector('input[type="email"]');
                if (emailInput.value && emailInput.value.includes('@')) {
                    showToast('¡Gracias por suscribirte! Te enviaremos las últimas ofertas.');
                    emailInput.value = '';
                } else {
                    showToast('Por favor, ingresa un correo electrónico válido.', 'error');
                }
            });
        }
    });
};