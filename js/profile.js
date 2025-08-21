// profile.js - Versión mejorada
import { updateAuthUI, checkAuth } from '../auth.js';
import { apiRequest, fetchUserProfile, updateUserProfile } from '../api.js';
import { showToast } from '../ui.js';

// Inicializar la página de perfil
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    if (!checkAuth()) return;
    
    updateAuthUI();
    await loadProfileData();
    setupEventListeners();
});

// Cargar datos del perfil
async function loadProfileData() {
    try {
        // Intentar cargar de la API primero
        const profileData = await fetchUserProfile();
        populateProfile(profileData);
    } catch (error) {
        // Fallback a datos locales
        const localData = JSON.parse(localStorage.getItem('userData') || '{}');
        populateProfile(localData);
    }
}

// Llenar el perfil con datos
function populateProfile(data) {
    // Información básica
    document.getElementById('profile-name').textContent = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Usuario';
    document.getElementById('profile-title').textContent = data.title || 'Profesional en tecnología';
    document.getElementById('profile-email').textContent = data.email || 'No especificado';
    document.getElementById('profile-phone').textContent = data.phone || 'No especificado';
    document.getElementById('profile-location').textContent = data.location || 'No especificado';
    document.getElementById('profile-birthdate').textContent = data.birthdate || 'No especificado';
    document.getElementById('profile-gender').textContent = getGenderText(data.gender);
    
    // Habilidades
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    if (data.skills && data.skills.length > 0) {
        data.skills.forEach(skill => {
            const skillBadge = document.createElement('span');
            skillBadge.className = 'badge bg-primary me-1 mb-1';
            skillBadge.textContent = skill;
            skillsContainer.appendChild(skillBadge);
        });
    } else {
        skillsContainer.innerHTML = '<span class="text-muted">No hay habilidades añadidas</span>';
    }
    
    // Experiencia laboral
    const experienceContainer = document.getElementById('experience-container');
    experienceContainer.innerHTML = '';
    if (data.experience && data.experience.length > 0) {
        data.experience.forEach(exp => {
            const expElement = createExperienceElement(exp);
            experienceContainer.appendChild(expElement);
        });
    } else {
        experienceContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-briefcase fa-3x text-muted mb-3"></i>
                <p class="text-muted">No hay experiencia laboral registrada</p>
                <button class="btn btn-accent btn-sm" data-bs-toggle="modal" data-bs-target="#experienceModal">
                    <i class="fas fa-plus me-1"></i> Añadir experiencia
                </button>
            </div>
        `;
    }
    
    // Educación
    const educationContainer = document.getElementById('education-container');
    educationContainer.innerHTML = '';
    if (data.education && data.education.length > 0) {
        data.education.forEach(edu => {
            const eduElement = createEducationElement(edu);
            educationContainer.appendChild(eduElement);
        });
    } else {
        educationContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-graduation-cap fa-3x text-muted mb-3"></i>
                <p class="text-muted">No hay educación registrada</p>
                <button class="btn btn-accent btn-sm" data-bs-toggle="modal" data-bs-target="#educationModal">
                    <i class="fas fa-plus me-1"></i> Añadir educación
                </button>
            </div>
        `;
    }
    
    // Documentos
    const documentsContainer = document.getElementById('documents-container');
    documentsContainer.innerHTML = '';
    if (data.documents && data.documents.length > 0) {
        data.documents.forEach(doc => {
            const docElement = createDocumentElement(doc);
            documentsContainer.appendChild(docElement);
        });
    } else {
        documentsContainer.innerHTML = `
            <div class="text-center py-3">
                <i class="fas fa-file fa-3x text-muted mb-2"></i>
                <p class="text-muted">No hay documentos subidos</p>
            </div>
        `;
    }
    
    // Llenar formulario de edición con datos actuales
    if (data.firstName) document.getElementById('editFirstName').value = data.firstName;
    if (data.lastName) document.getElementById('editLastName').value = data.lastName;
    if (data.email) document.getElementById('editEmail').value = data.email;
    if (data.phone) document.getElementById('editPhone').value = data.phone;
    if (data.location) document.getElementById('editLocation').value = data.location;
    if (data.birthdate) document.getElementById('editBirthdate').value = data.birthdate;
    if (data.gender) document.getElementById('editGender').value = data.gender;
    if (data.title) document.getElementById('editTitle').value = data.title;
    if (data.bio) document.getElementById('editBio').value = data.bio;
}

// Configurar event listeners
function setupEventListeners() {
    // Guardar perfil
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfile);
    
    // Añadir habilidad
    document.getElementById('addSkillBtn').addEventListener('click', addSkill);
    
    // Cambiar foto
    document.getElementById('change-picture-btn').addEventListener('click', changeProfilePicture);
}

// Guardar perfil
async function saveProfile() {
    try {
        const formData = {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            location: document.getElementById('editLocation').value,
            birthdate: document.getElementById('editBirthdate').value,
            gender: document.getElementById('editGender').value,
            title: document.getElementById('editTitle').value,
            bio: document.getElementById('editBio').value
        };
        
        // Actualizar en localStorage inmediatamente para mejor experiencia de usuario
        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        const updatedUserData = { ...currentUserData, ...formData };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Intentar guardar en la API
        try {
            await updateUserProfile(formData);
            showToast('Perfil actualizado correctamente');
        } catch (error) {
            // Si falla la API, al menos tenemos los datos en localStorage
            showToast('Perfil guardado localmente (modo offline)');
        }
        
        // Recargar datos
        await loadProfileData();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        if (modal) modal.hide();
    } catch (error) {
        console.error('Error saving profile:', error);
        showToast('Error al guardar el perfil', 'error');
    }
}

// Añadir habilidad
function addSkill() {
    const skillInput = document.getElementById('skillInput');
    const skill = skillInput.value.trim();
    
    if (skill) {
        const skillsList = document.getElementById('skills-list');
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item d-flex align-items-center bg-light rounded-pill px-3 py-1';
        skillElement.innerHTML = `
            <span class="me-2">${skill}</span>
            <button type="button" class="btn-close btn-close-sm" aria-label="Eliminar"></button>
        `;
        
        skillsList.appendChild(skillElement);
        skillInput.value = '';
        
        // Configurar evento para eliminar
        skillElement.querySelector('.btn-close').addEventListener('click', function() {
            skillElement.remove();
        });
        
        // Actualizar habilidades en el perfil
        const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (!currentUserData.skills) currentUserData.skills = [];
        currentUserData.skills.push(skill);
        localStorage.setItem('userData', JSON.stringify(currentUserData));
        
        // Actualizar visualización de habilidades
        const skillsContainer = document.getElementById('skills-container');
        const skillBadge = document.createElement('span');
        skillBadge.className = 'badge bg-primary me-1 mb-1';
        skillBadge.textContent = skill;
        skillsContainer.appendChild(skillBadge);
    }
}

// Cambiar foto de perfil
function changeProfilePicture() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Mostrar una preview
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('profile-picture').src = e.target.result;
                
                // Guardar en localStorage como URL de datos
                const currentUserData = JSON.parse(localStorage.getItem('userData') || '{}');
                currentUserData.profilePicture = e.target.result;
                localStorage.setItem('userData', JSON.stringify(currentUserData));
            };
            reader.readAsDataURL(file);
            
            showToast('Foto de perfil actualizada');
        }
    };
    
    input.click();
}

// Helper functions
function getGenderText(gender) {
    const genders = {
        'male': 'Masculino',
        'female': 'Femenino',
        'other': 'Otro',
        'prefer_not_to_say': 'Prefiero no decir'
    };
    return genders[gender] || 'No especificado';
}

function createExperienceElement(exp) {
    const element = document.createElement('div');
    element.className = 'experience-item mb-4';
    
    const dateText = exp.current 
        ? `${formatDate(exp.startDate)} - Presente` 
        : `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`;
    
    element.innerHTML = `
        <div class="d-flex justify-content-between">
            <h6>${exp.position}</h6>
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#"><i class="fas fa-edit me-2"></i> Editar</a></li>
                    <li><a class="dropdown-item" href="#"><i class="fas fa-trash me-2"></i> Eliminar</a></li>
                </ul>
            </div>
        </div>
        <p class="text-muted mb-1">${exp.company}</p>
        <p class="text-muted small mb-2">${dateText} · ${exp.location}</p>
        <p>${exp.description}</p>
    `;
    
    return element;
}

function createEducationElement(edu) {
    const element = document.createElement('div');
    element.className = 'education-item mb-4';
    
    element.innerHTML = `
        <div class="d-flex justify-content-between">
            <h6>${edu.degree}</h6>
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#"><i class="fas fa-edit me-2"></i> Editar</a></li>
                    <li><a class="dropdown-item" href="#"><i class="fas fa-trash me-2"></i> Eliminar</a></li>
                </ul>
            </div>
        </div>
        <p class="text-muted mb-1">${edu.institution}</p>
        <p class="text-muted small">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</p>
        ${edu.description ? `<p>${edu.description}</p>` : ''}
    `;
    
    return element;
}

function createDocumentElement(doc) {
    const element = document.createElement('div');
    element.className = 'mb-3';
    
    element.innerHTML = `
        <div class="d-flex justify-content-between align-items-center bg-light p-3 rounded">
            <div>
                <i class="fas fa-file-pdf text-danger me-2"></i>
                <span>${doc.name}</span>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-primary me-1"><i class="fas fa-download"></i></button>
                <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
    
    return element;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
}