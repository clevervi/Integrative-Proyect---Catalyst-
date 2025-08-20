import { updateAuthUI } from '../auth.js';
import { apiRequest, fetchJobDetails, applyToJob, fetchJobs } from '../api.js';
import { showToast } from '../ui.js';
import { isJobFavorite, handleFavoriteClick, updateFavoritesUI } from '../jobs.js';

// Inicializar la página de detalle de empleo
document.addEventListener('DOMContentLoaded', async () => {
    // Actualizar UI de autenticación
    updateAuthUI();

    // Obtener ID del empleo de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    if (!jobId) {
        showToast('No se ha especificado un empleo', 'error');
        window.location.href = 'empleos.html';
        return;
    }

    try {
        // Cargar detalles del empleo
        await loadJobDetails(jobId);
        
        // Cargar empleos similares
        await loadSimilarJobs(jobId);
        
        // Configurar event listeners
        setupEventListeners(jobId);
    } catch (error) {
        console.error('Error al cargar el detalle del empleo:', error);
        showToast('Error al cargar los detalles del empleo', 'error');
    }
});

// Cargar detalles del empleo
async function loadJobDetails(jobId) {
    try {
        const jobData = await fetchJobDetails(jobId);
        populateJobDetails(jobData);
        updateFavoritesUI();
    } catch (error) {
        console.error('Error fetching job details:', error);
        // Mostrar datos de ejemplo si la API no está disponible
        showSampleJobDetails(jobId);
    }
}

// Llenar los detalles del empleo
function populateJobDetails(job) {
    // Información básica
    document.getElementById('job-title').textContent = job.title;
    document.getElementById('company-name').textContent = job.company.name;
    document.getElementById('company-logo').src = job.company.logo || '../img/image.png';
    document.getElementById('company-logo').alt = job.company.name;
    
    if (job.company.verified) {
        document.getElementById('verified-badge').style.display = 'inline-block';
    }
    
    // Metadatos
    document.getElementById('modality-badge').innerHTML = `<i class="fas ${getModalityIcon(job.modality)} me-1"></i> ${job.modality}`;
    document.getElementById('level-badge').innerHTML = `<i class="fas ${getLevelIcon(job.level)} me-1"></i> ${job.level}`;
    document.getElementById('contract-badge').innerHTML = `<i class="fas fa-clock me-1"></i> ${job.contractType}`;
    
    document.getElementById('job-location').textContent = job.location;
    document.getElementById('job-salary').textContent = formatSalary(job.salary);
    document.getElementById('job-posted').textContent = `Publicado ${formatRelativeTime(job.postedDate)}`;
    
    // Descripción y detalles
    document.getElementById('job-description').innerHTML = `<p>${job.description}</p>`;
    
    if (job.requirements) {
        document.getElementById('job-requirements').innerHTML = formatList(job.requirements);
    }
    
    if (job.responsibilities) {
        document.getElementById('job-responsibilities').innerHTML = formatList(job.responsibilities);
    }
    
    if (job.benefits) {
        document.getElementById('job-benefits').innerHTML = formatList(job.benefits);
    }
    
    // Información de la empresa
    document.getElementById('company-detail-name').textContent = job.company.name;
    document.getElementById('company-detail-logo').src = job.company.logo || '../img/image.png';
    document.getElementById('company-detail-logo').alt = job.company.name;
    document.getElementById('company-industry').textContent = job.company.industry || 'Tecnología';
    document.getElementById('company-description').textContent = job.company.description || 'Empresa líder en el sector tecnológico.';
    
    if (job.company.size) {
        document.getElementById('company-size').textContent = `${job.company.size} empleados`;
    }
    
    if (job.company.founded) {
        document.getElementById('company-founded').textContent = `Fundada en ${job.company.founded}`;
    }
    
    if (job.company.website) {
        document.getElementById('company-website').href = job.company.website;
    } else {
        document.getElementById('company-website').style.display = 'none';
    }
    
    // Configurar favoritos
    const favoriteBtn = document.getElementById('favorite-btn');
    const heartIcon = favoriteBtn.querySelector('i');
    
    if (isJobFavorite(job.id)) {
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas', 'text-danger');
    }
    
    favoriteBtn.dataset.jobId = job.id;
}

// Mostrar detalles de ejemplo
function showSampleJobDetails(jobId) {
    const sampleJob = {
        id: jobId,
        title: "Desarrollador Backend Senior",
        company: {
            name: "Innovatech Solutions",
            logo: "../img/image.png",
            verified: true,
            industry: "Tecnología y Servicios",
            description: "Empresa líder en desarrollo de software con más de 10 años en el mercado. Especializados en soluciones empresariales.",
            size: "150",
            founded: "2012",
            website: "https://innovatech.example.com"
        },
        description: "Buscamos desarrollador backend con experiencia en Node.js, TypeScript y arquitecturas de microservicios para unirse a nuestro equipo de desarrollo de plataforma SaaS. Trabajarás con tecnologías como Kubernetes, AWS y GraphQL en un entorno ágil.",
        requirements: [
            "5+ años de experiencia en desarrollo backend",
            "Experiencia con Node.js y TypeScript",
            "Conocimiento de arquitecturas de microservicios",
            "Experiencia con bases de datos SQL y NoSQL",
            "Conocimiento de Docker y Kubernetes",
            "Experiencia con AWS o Azure"
        ],
        responsibilities: [
            "Desarrollar y mantener APIs RESTful y GraphQL",
            "Diseñar e implementar arquitecturas escalables",
            "Colaborar con el equipo frontend para integrar funcionalidades",
            "Optimizar el rendimiento de aplicaciones",
            "Participar en code reviews y mentoría a desarrolladores junior"
        ],
        benefits: [
            "Salario competitivo",
            "Horario flexible",
            "Trabajo remoto",
            "Seguro médico",
            "Capacitaciones pagas",
            "Bonos por desempeño"
        ],
        modality: "Remoto",
        level: "Senior",
        contractType: "Tiempo completo",
        location: "Bogotá / Remoto",
        salary: {
            min: 8000000,
            max: 12000000
        },
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    populateJobDetails(sampleJob);
}

// Cargar empleos similares
async function loadSimilarJobs(jobId) {
    try {
        // En una implementación real, buscaríamos empleos similares basados en categoría, habilidades, etc.
        const similarJobs = await fetchJobs({ limit: 3 });
        populateSimilarJobs(similarJobs);
    } catch (error) {
        console.error('Error fetching similar jobs:', error);
        showSampleSimilarJobs();
    }
}

// Llenar empleos similares
function populateSimilarJobs(jobs) {
    const container = document.getElementById('similar-jobs');
    container.innerHTML = '';
    
    if (jobs.length === 0) {
        container.innerHTML = '<p class="text-muted">No se encontraron empleos similares</p>';
        return;
    }
    
    jobs.slice(0, 3).forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.className = 'similar-job mb-3 p-3 border rounded';
        
        jobElement.innerHTML = `
            <h6 class="mb-1">${job.title}</h6>
            <p class="small text-muted mb-1">${job.company.name}</p>
            <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-primary-light text-primary">${job.modality}</span>
                <a href="detalle-empleo.html?id=${job.id}" class="btn btn-sm btn-outline-primary">Ver</a>
            </div>
        `;
        
        container.appendChild(jobElement);
    });
}

// Mostrar empleos similares de ejemplo
function showSampleSimilarJobs() {
    const sampleJobs = [
        {
            id: 101,
            title: "Desarrollador Node.js",
            company: { name: "Tech Solutions" },
            modality: "Remoto"
        },
        {
            id: 102,
            title: "Ingeniero de Software Backend",
            company: { name: "Data Systems" },
            modality: "Híbrido"
        },
        {
            id: 103,
            title: "Arquitecto de APIs",
            company: { name: "Cloud Innovations" },
            modality: "Remoto"
        }
    ];
    
    populateSimilarJobs(sampleJobs);
}

// Configurar event listeners
function setupEventListeners(jobId) {
    // Botón de favoritos
    document.getElementById('favorite-btn').addEventListener('click', handleFavoriteClick);
    
    // Botón de postulación
    document.getElementById('apply-btn').addEventListener('click', function() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            showToast('Debes iniciar sesión para postularte', 'error');
            return;
        }
        
        const applyModal = new bootstrap.Modal(document.getElementById('applyModal'));
        applyModal.show();
    });
    
    // Enviar postulación
    document.getElementById('submit-application').addEventListener('click', async function() {
        try {
            const applicationData = {
                message: document.getElementById('applicationMessage').value,
                cv: 'Mi_CV_Principal.pdf' // En una implementación real, esto vendría del perfil
            };
            
            await applyToJob(jobId, applicationData);
            showToast('¡Postulación enviada correctamente!');
            
            const applyModal = bootstrap.Modal.getInstance(document.getElementById('applyModal'));
            applyModal.hide();
        } catch (error) {
            console.error('Error applying to job:', error);
            showToast('Error al enviar la postulación', 'error');
        }
    });
}

// Helper functions
function getModalityIcon(modality) {
    const icons = {
        'Remoto': 'fa-laptop-house',
        'Presencial': 'fa-building',
        'Híbrido': 'fa-laptop-house'
    };
    return icons[modality] || 'fa-briefcase';
}

function getLevelIcon(level) {
    const icons = {
        'Trainee': 'fa-seedling',
        'Junior': 'fa-graduation-cap',
        'Semi-Senior': 'fa-star-half-alt',
        'Senior': 'fa-star',
        'Architect': 'fa-crown'
    };
    return icons[level] || 'fa-user';
}

function formatSalary(salary) {
    if (!salary || (!salary.min && !salary.max)) return 'Salario a convenir';
    return `$${salary.min?.toLocaleString() || ''} - $${salary.max?.toLocaleString() || ''}`;
}

function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'hace 1 día';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
    return `hace ${Math.floor(diffDays / 30)} meses`;
}

function formatList(items) {
    if (!items || !Array.isArray(items)) return '<p>No especificado</p>';
    return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}