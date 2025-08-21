import { apiRequest, fetchJobs, applyToJob, fetchJobDetails } from './api.js';
import { showToast } from './ui.js';

// Inicializar búsqueda de empleos
export const initJobSearch = () => {
    const searchForm = document.querySelector('.search-box form');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(searchForm);
            const filters = {
                query: formData.get('query'),
                location: formData.get('location'),
            };
            try {
                const jobs = await fetchJobs(filters);
                renderJobList(jobs);
            } catch (error) {
                showToast(error.message, 'error');
            }
        });
    }
};

// Manejar clic en botón de postulación y favoritos
export const handleFavorites = () => {
    document.addEventListener('click', async (e) => {
        // Manejar clic en botón de favoritos
        if (e.target.closest('.favorite-btn')) {
            handleFavoriteClick(e);
        }
        // Manejar clic en botón "Ver detalles"
        if (e.target.closest('.view-details-btn')) {
            const jobId = e.target.closest('.view-details-btn').dataset.jobId;
            await showJobDetailsModal(jobId);
        }
    });
};

const handleFavoriteClick = (e) => {
    const favoriteBtn = e.target.closest('.favorite-btn');
    const heartIcon = favoriteBtn.querySelector('i');
    const jobCard = e.target.closest('.job-card');
    const jobId = jobCard.dataset.jobId;
    
    let favorites = JSON.parse(localStorage.getItem('favoriteJobs') || '[]');
    
    if (heartIcon.classList.contains('far')) {
        // Añadir a favoritos
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas', 'text-danger');
        favorites.push(jobId);
        showToast('Empleo añadido a favoritos');
    } else {
        // Quitar de favoritos
        heartIcon.classList.remove('fas', 'text-danger');
        heartIcon.classList.add('far');
        favorites = favorites.filter(id => id !== jobId);
        showToast('Empleo eliminado de favoritos');
    }
    
    localStorage.setItem('favoriteJobs', JSON.stringify(favorites));
};

export const updateFavoritesUI = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteJobs') || '[]');
    document.querySelectorAll('.job-card').forEach(card => {
        const jobId = card.dataset.jobId;
        const heartIcon = card.querySelector('.favorite-btn i');
        if (heartIcon && favorites.includes(jobId)) {
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas', 'text-danger');
        } else if (heartIcon) {
            heartIcon.classList.remove('fas', 'text-danger');
            heartIcon.classList.add('far');
        }
    });
};

// Renderizar lista de empleos
export const renderJobList = (jobs, containerSelector = '.job-list') => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    container.innerHTML = jobs.map(job => `
    <div class="col-md-4 mb-4">
        <div class="job-card h-100 position-relative" data-job-id="${job.id}">
            ${job.featured ? '<span class="featured-badge">Destacado</span>' : ''}
            ${job.isNew ? '<span class="new-badge">NUEVO</span>' : ''}
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <div>
                        <h3 class="job-title">${job.title}</h3>
                        <div class="d-flex align-items-center mb-2">
                            <img src="${job.company.logo || 'img/image.png'}" alt="${job.company.name}" class="rounded-circle me-2" width="24" loading="lazy">
                            <p class="company-name mb-0">${job.company.name}</p>
                            ${job.company.verified ? `
                            <span class="verified-badge ms-2" data-bs-toggle="tooltip" title="Empresa verificada">
                                <i class="fas fa-check-circle text-primary"></i>
                            </span>
                            ` : ''}
                        </div>
                    </div>
                    <button class="favorite-btn">
                        <i class="${isJobFavorite(job.id) ? 'fas text-danger' : 'far'} fa-heart"></i>
                    </button>
                </div>
                
                <div class="job-meta mb-3">
                    <span class="badge bg-primary-light text-primary me-2">
                        <i class="fas ${getModalityIcon(job.modality)} me-1"></i> ${job.modality}
                    </span>
                    <span class="badge bg-success-light text-success me-2">
                        <i class="fas ${getLevelIcon(job.level)} me-1"></i> ${job.level}
                    </span>
                    <span class="badge bg-info-light text-info">
                        <i class="fas fa-clock me-1"></i> ${job.contractType}
                    </span>
                </div>
                
                <p class="job-description">${job.description}</p>
                
                <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mt-auto">
                    <div class="mb-2 mb-sm-0">
                        <span class="text-muted small">
                            <i class="fas fa-map-marker-alt me-1"></i> ${job.location}
                        </span>
                        ${job.salary ? `
                        <span class="text-muted small ms-2">
                            <i class="fas fa-money-bill-wave me-1"></i> ${formatSalary(job.salary)}
                        </span>
                        ` : ''}
                    </div>
                    <button class="btn btn-sm btn-accent view-details-btn" data-job-id="${job.id}">Ver detalles</button>
                </div>
            </div>
        </div>
    </div>
    `).join('');

    // Actualizar la UI de favoritos después de renderizar
    updateFavoritesUI();
};

// Función para mostrar el modal de detalles del empleo
export const showJobDetailsModal = async (jobId) => {
    try {
        const job = await fetchJobDetails(jobId);
        if (!job) {
            showToast('No se encontraron detalles para este empleo.', 'error');
            return;
        }

        const modalTitle = document.getElementById('jobDetailsModalLabel');
        const modalBody = document.getElementById('jobDetailsModalBody');

        modalTitle.textContent = job.title;
        modalBody.innerHTML = `
            <div class="d-flex align-items-center mb-3">
                <img src="${job.company.logo || '../img/image.png'}" alt="${job.company.name}" class="rounded-circle me-3" width="50">
                <div>
                    <h5 class="mb-0">${job.company.name}</h5>
                    <p class="text-muted mb-0">${job.company.industry || 'Tecnología'}</p>
                </div>
            </div>
            <p class="text-muted small mb-3">Publicado: ${formatRelativeTime(job.postedDate)}</p>
            
            <div class="job-meta mb-3">
                <span class="badge bg-primary-light text-primary me-2">
                    <i class="fas ${getModalityIcon(job.modality)} me-1"></i> ${job.modality}
                </span>
                <span class="badge bg-success-light text-success me-2">
                    <i class="fas ${getLevelIcon(job.level)} me-1"></i> ${job.level}
                </span>
                <span class="badge bg-info-light text-info">
                    <i class="fas fa-clock me-1"></i> ${job.contractType}
                </span>
            </div>

            <p><strong>Ubicación:</strong> ${job.location}</p>
            <p><strong>Salario:</strong> ${formatSalary(job.salary)}</p>

            <h6>Descripción del Empleo:</h6>
            <p>${job.description}</p>

            <h6>Requisitos:</h6>
            ${formatList(job.requirements)}

            <h6>Responsabilidades:</h6>
            ${formatList(job.responsibilities)}

            <h6>Beneficios:</h6>
            ${formatList(job.benefits)}

            <hr>
            <h6>Acerca de la Empresa:</h6>
            <p>${job.company.description}</p>
            <p>Tamaño: ${job.company.size} empleados</p>
            <p>Fundada: ${job.company.founded}</p>
            <p><a href="${job.company.website}" target="_blank">Visitar sitio web</a></p>
        `;

        // Configurar botón de aplicar
        const applyBtn = document.getElementById('applyJobBtn');
        if (applyBtn) {
            applyBtn.dataset.jobId = jobId;
        }

        const jobDetailsModal = new bootstrap.Modal(document.getElementById('jobDetailsModal'));
        jobDetailsModal.show();

    } catch (error) {
        console.error('Error al cargar los detalles del empleo en el modal:', error);
        showToast('Error al cargar los detalles del empleo.', 'error');
    }
};

// Obtener icono según la modalidad
const getModalityIcon = (modality) => {
    const icons = {
        'Remoto': 'fa-laptop-house',
        'Presencial': 'fa-building',
        'Híbrido': 'fa-laptop-house'
    };
    return icons[modality] || 'fa-briefcase';
};

// Obtener icono según el nivel
const getLevelIcon = (level) => {
    const icons = {
        'Trainee': 'fa-seedling',
        'Junior': 'fa-graduation-cap',
        'Semi-Senior': 'fa-star-half-alt',
        'Senior': 'fa-star',
        'Architect': 'fa-crown'
    };
    return icons[level] || 'fa-user';
};

// Formatear salario
const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Salario a convenir';
    return `$${salary.min?.toLocaleString() || ''} - $${salary.max?.toLocaleString() || ''}`;
};

// Verificar si un trabajo está en favoritos
const isJobFavorite = (jobId) => {
    const favorites = JSON.parse(localStorage.getItem('favoriteJobs') || '[]');
    return favorites.includes(jobId.toString());
};

// Formatear lista (para requisitos, responsabilidades, beneficios)
const formatList = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) return '<p>No especificado</p>';
    return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
};

// Formatear tiempo relativo
const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'hoy';
    if (diffDays === 1) return 'hace 1 día';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
    return `hace ${Math.floor(diffDays / 30)} meses`;
};