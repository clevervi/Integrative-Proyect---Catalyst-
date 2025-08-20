import { apiRequest, fetchJobs, applyToJob } from './api.js';
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
// export const renderJobList = (jobs, containerSelector = '.job-list') => {
//     const container = document.querySelector(containerSelector);
//     if (!container) return;
    
//     container.innerHTML = jobs.map(job => `
//     <div class="col-md-4 mb-4">
//         <div class="job-card h-100 position-relative" data-job-id="${job.id}">
//             ${job.featured ? '<span class="featured-badge">Destacado</span>' : ''}
//             ${job.isNew ? '<span class="new-badge">NUEVO</span>' : ''}
//             <div class="card-body">
//                 <div class="d-flex justify-content-between">
//                     <div>
//                         <h3 class="job-title">${job.title}</h3>
//                         <div class="d-flex align-items-center mb-2">
//                             <img src="${job.company.logo || 'img/image.png'}" alt="${job.company.name}" class="rounded-circle me-2" width="24" loading="lazy">
//                             <p class="company-name mb-0">${job.company.name}</p>
//                             ${job.company.verified ? `
//                             <span class="verified-badge ms-2" data-bs-toggle="tooltip" title="Empresa verificada">
//                                 <i class="fas fa-check-circle text-primary"></i>
//                             </span>
//                             ` : ''}
//                         </div>
//                     </div>
//                     <button class="favorite-btn">
//                         <i class="${isJobFavorite(job.id) ? 'fas text-danger' : 'far'} fa-heart"></i>
//                     </button>
//                 </div>
                
//                 <div class="job-meta mb-3">
//                     <span class="badge bg-primary-light text-primary me-2">
//                         <i class="fas ${getModalityIcon(job.modality)} me-1"></i> ${job.modality}
//                     </span>
//                     <span class="badge bg-success-light text-success me-2">
//                         <i class="fas ${getLevelIcon(job.level)} me-1"></i> ${job.level}
//                     </span>
//                     <span class="badge bg-info-light text-info">
//                         <i class="fas fa-clock me-1"></i> ${job.contractType}
//                     </span>
//                 </div>
                
//                 <p class="job-description">${job.description}</p>
                
//                 <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mt-auto">
//                     <div class="mb-2 mb-sm-0">
//                         <span class="text-muted small">
//                             <i class="fas fa-map-marker-alt me-1"></i> ${job.location}
//                         </span>
//                         ${job.salary ? `
//                         <span class="text-muted small ms-2">
//                             <i class="fas fa-money-bill-wave me-1"></i> ${formatSalary(job.salary)}
//                         </span>
//                         ` : ''}
//                     </div>
//                     <a href="pages/detalle-empleo.html?id=${job.id}" class="btn btn-sm btn-accent">Ver detalles</a>
//                 </div>
//             </div>
//         </div>
//     </div>
//     `).join('');

//     // Actualizar la UI de favoritos después de renderizar
//     updateFavoritesUI();
// };

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