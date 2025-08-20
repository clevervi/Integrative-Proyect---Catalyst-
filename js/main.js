import { handleAuth, updateAuthUI } from './auth.js';
import { initJobSearch, renderJobList, handleFavorites } from './jobs.js';
import { initUIFunctions, showToast } from './ui.js';
import { fetchJobs } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar autenticación
    handleAuth();
    updateAuthUI();

    // Inicializar funciones de UI
    initUIFunctions();

    // Cargar empleos si estamos en la página de empleos
    if (window.location.pathname.includes('empleos.html')) {
        loadInitialJobs();
        initJobSearch();
    }
    
    // Si estamos en la página principal, cargar empleos destacados
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        loadFeaturedJobs();
        initJobSearch(); // Permite la búsqueda desde la página principal
    }

    // Manejar favoritos
    handleFavorites();
});

async function loadInitialJobs() {
    try {
        // Obtener parámetros de búsqueda de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const filters = {};
        
        if (urlParams.get('search')) filters.query = urlParams.get('search');
        if (urlParams.get('category')) filters.category = urlParams.get('category');
        if (urlParams.get('location')) filters.location = urlParams.get('location');
        
        const jobs = await fetchJobs(filters);
        renderJobList(jobs);
    } catch (error) {
        showToast(error.message, 'error');
        // Cargar datos de ejemplo si la API no está disponible
        loadSampleJobs();
    }
}

async function loadFeaturedJobs() {
    try {
        const jobs = await fetchJobs({ featured: true });
        renderJobList(jobs, '.featured-jobs .row');
    } catch (error) {
        showToast('Error cargando empleos destacados', 'error');
        // Cargar datos de ejemplo si la API no está disponible
        loadSampleFeaturedJobs();
    }
}

// Cargar empleos de ejemplo si la API no está disponible
function loadSampleJobs() {
    const sampleJobs = [
        {
            id: 1,
            title: "Desarrollador Full Stack",
            company: {
                name: "Tech Solutions Inc.",
                logo: "img/image.png",
                verified: true
            },
            description: "Buscamos desarrollador full stack con experiencia en React, Node.js y MongoDB para unirse a nuestro equipo de desarrollo.",
            modality: "Remoto",
            level: "Senior",
            contractType: "Tiempo completo",
            location: "Bogotá / Remoto",
            salary: {
                min: 5000000,
                max: 8000000
            },
            featured: true
        },
        {
            id: 2,
            title: "Ingeniero de DevOps",
            company: {
                name: "Cloud Innovations",
                logo: "img/image.png",
                verified: false
            },
            description: "Buscamos ingeniero de DevOps con experiencia en AWS, Docker y Kubernetes para automatizar nuestros procesos de despliegue.",
            modality: "Híbrido",
            level: "Semi-Senior",
            contractType: "Tiempo completo",
            location: "Medellín",
            salary: {
                min: 4000000,
                max: 6000000
            },
            isNew: true
        }
    ];
    
    renderJobList(sampleJobs);
}

function loadSampleFeaturedJobs() {
    const sampleJobs = [
        {
            id: 1,
            title: "Desarrollador React Senior",
            company: {
                name: "Digital Creative",
                logo: "img/image.png",
                verified: true
            },
            description: "Buscamos desarrollador React senior con experiencia en TypeScript y Next.js para proyectos innovadores.",
            modality: "Remoto",
            level: "Senior",
            contractType: "Tiempo completo",
            location: "Colombia Remoto",
            salary: {
                min: 6000000,
                max: 9000000
            },
            featured: true
        },
        {
            id: 2,
            title: "Arquitecto de Soluciones Cloud",
            company: {
                name: "Cloud Technologies",
                logo: "img/image.png",
                verified: true
            },
            description: "Buscamos arquitecto de soluciones con experiencia en diseño de sistemas escalables en AWS o Azure.",
            modality: "Híbrido",
            level: "Architect",
            contractType: "Tiempo completo",
            location: "Bogotá",
            salary: {
                min: 10000000,
                max: 15000000
            }
        }
    ];
    
    renderJobList(sampleJobs, '.featured-jobs .row');
}