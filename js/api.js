const API_BASE_URL = 'http://localhost:3000';

// Función genérica para hacer requests
export const apiRequest = async (endpoint, method = 'GET', body = null, requiresAuth = true) => {
    // Configuración de headers
    const headers = {
        'Content-Type': 'application/json'
    };

    // Añadir token de autenticación si es necesario
    if (requiresAuth) {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No autenticado');
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Configuración de la solicitud
    const config = {
        method,
        headers
    };

    // Añadir cuerpo si existe
    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        // Hacer la solicitud
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        // Manejar errores
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error en la solicitud');
        }

        // Para respuestas sin contenido (como DELETE)
        if (response.status === 204) {
            return null;
        }

        return response.json();
    } catch (error) {
        console.error('Error en la solicitud API:', error);
        throw error;
    }
};

// Funciones específicas
export const authenticateUser = (email, password) => {
    return apiRequest('/auth/login', 'POST', { email, password }, false);
};

export const registerUser = (userData) => {
    return apiRequest('/auth/register', 'POST', userData, false);
};

export const fetchJobs = (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/jobs?${queryParams}`);
};

export const fetchJobDetails = (jobId) => {
    return apiRequest(`/jobs/${jobId}`);
};

export const applyToJob = (jobId, applicationData) => {
    return apiRequest(`/jobs/${jobId}/apply`, 'POST', applicationData);
};

export const fetchUserProfile = () => {
    return apiRequest('/profile');
};

export const updateUserProfile = (profileData) => {
    return apiRequest('/profile', 'PUT', profileData);
};

export const fetchTrainings = (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/trainings?${queryParams}`);
};