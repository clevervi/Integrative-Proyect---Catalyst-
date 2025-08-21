const API_BASE_URL = 'http://localhost:3000';

// Función genérica para hacer requests
export const apiRequest = async (endpoint, method, body = null) => {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        config.body = JSON.stringify(body);
        console.log("Info Loaded")
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        
        // Para respuestas sin contenido
        if (response.status === 204) {
            return null;
        }
        
        return response.json();
    } catch (error) {
        console.error('Error en la solicitud API:', error);
        
        // En caso de error, usar datos locales para demostración
        // return getLocalData(endpoint);
    }
};

// Datos locales para demostración cuando el servidor no esté disponible
// const getLocalData = (endpoint) => {
//     const localData = {
//         '/users': [
//             {
//                 id: 1,
//                 email: "demo@catalyst.com",
//                 password: "demo123",
//                 firstName: "Ana",
//                 lastName: "García",
//                 title: "Desarrolladora Backend",
//                 skills: ["JavaScript", "Node.js", "Express", "MongoDB"],
//                 experience: [
//                     {
//                         position: "Desarrolladora Backend",
//                         company: "Tech Solutions",
//                         startDate: "2022-01-01",
//                         current: true,
//                         description: "Desarrollo de APIs RESTful con Node.js"
//                     }
//                 ],
//                 education: [
//                     {
//                         degree: "Ingeniería de Sistemas",
//                         institution: "Universidad Nacional",
//                         endDate: "2021-12-01"
//                     }
//                 ]
//             }
//         ],
//         '/jobs': [
//             {
//                 id: 1,
//                 title: "Ingeniero DevOps",
//                 company: {
//                     name: "Tech Solutions Inc.",
//                     logo: "../img/image.png",
//                     verified: true,
//                     description: "Empresa líder en soluciones tecnológicas",
//                     size: "200-500 empleados",
//                     founded: "2010",
//                     website: "https://techsolutions.com"
//                 },
//                 description: "Buscamos ingeniero DevOps con experiencia en AWS, Kubernetes y Terraform.",
//                 modality: "Remoto",
//                 level: "Senior",
//                 contractType: "Tiempo completo",
//                 location: "Bogotá / Remoto",
//                 salary: {
//                     min: 8000000,
//                     max: 12000000
//                 },
//                 requirements: [
//                     "Experiencia con AWS",
//                     "Conocimiento de Kubernetes",
//                     "Manejo de Terraform",
//                     "3+ años de experiencia en DevOps",
//                     "Inglés intermedio"
//                 ],
//                 responsibilities: [
//                     "Automatizar procesos de despliegue",
//                     "Mantener la infraestructura en la nube",
//                     "Optimizar recursos y costos",
//                     "Implementar prácticas de seguridad"
//                 ],
//                 benefits: [
//                     "Trabajo remoto",
//                     "Horario flexible",
//                     "Capacitaciones",
//                     "Seguro de salud",
//                     "Bonos por desempeño"
//                 ],
//                 postedDate: "2024-01-15",
//                 featured: true
//             },
//             {
//                 id: 2,
//                 title: "Desarrollador React Senior",
//                 company: {
//                     name: "Digital Creative",
//                     logo: "../img/image.png",
//                     verified: false,
//                     description: "Agencia de desarrollo web y móvil",
//                     size: "50-100 empleados",
//                     founded: "2018",
//                     website: "https://digitalcreative.com"
//                 },
//                 description: "Buscamos desarrollador React senior con experiencia en TypeScript y Next.js.",
//                 modality: "Híbrido",
//                 level: "Senior",
//                 contractType: "Tiempo completo",
//                 location: "Medellín",
//                 salary: {
//                     min: 6000000,
//                     max: 9000000
//                 },
//                 requirements: [
//                     "5+ años con React",
//                     "Experiencia con TypeScript",
//                     "Conocimiento de Next.js",
//                     "Manejo de estado global (Redux/Zustand)"
//                 ],
//                 responsibilities: [
//                     "Desarrollar componentes reutilizables",
//                     "Optimizar performance",
//                     "Colaborar con equipo de diseño",
//                     "Mentorizar desarrolladores junior"
//                 ],
//                 benefits: [
//                     "Trabajo híbrido",
//                     "Flexibilidad horaria",
//                     "Presupuesto para capacitación",
//                     "Oficina moderna"
//                 ],
//                 postedDate: "2024-01-10",
//                 isNew: true
//             },
//             {
//                 id: 3,
//                 title: "Arquitecto de Soluciones Cloud",
//                 company: {
//                     name: "Cloud Technologies",
//                     logo: "../img/image.png",
//                     verified: true,
//                     description: "Especialistas en soluciones cloud",
//                     size: "100-200 empleados",
//                     founded: "2015",
//                     website: "https://cloudtech.com"
//                 },
//                 description: "Buscamos arquitecto de soluciones con experiencia en diseño de sistemas escalables.",
//                 modality: "Presencial",
//                 level: "Architect",
//                 contractType: "Tiempo completo",
//                 location: "Bogotá",
//                 salary: {
//                     min: 12000000,
//                     max: 18000000
//                 },
//                 requirements: [
//                     "8+ años de experiencia",
//                     "Certificaciones AWS/Azure",
//                     "Experiencia en arquitecturas microservicios",
//                     "Conocimiento de patrones de diseño"
//                 ],
//                 responsibilities: [
//                     "Diseñar arquitecturas escalables",
//                     "Liderar decisiones técnicas",
//                     "Optimizar costos en la nube",
//                     "Mentorizar equipos de desarrollo"
//                 ],
//                 benefits: [
//                     "Salario competitivo",
//                     "Bonos por resultados",
//                     "Seguro premium",
//                     "Stock options"
//                 ],
//                 postedDate: "2024-01-05"
//             }
//         ]
//     };

//     // Para endpoints específicos como /jobs/1
//     if (endpoint.startsWith('/jobs/')) {
//         const jobId = parseInt(endpoint.split('/')[2]);
//         const job = localData['/jobs'].find(j => j.id === jobId);
//         return Promise.resolve(job || null);
//     }
    
//     return Promise.resolve(localData[endpoint] || []);
// };

// Funciones específicas
export const authenticateUser = (email, password) => {
    return apiRequest('/users').then(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) throw new Error('Credenciales incorrectas');
        return { user, token: 'demo-token' };
    });
};

export const registerUser = (userData) => {
    return apiRequest('/users', 'POST', userData);
};

export const fetchJobs = (filters = {}) => {
    return apiRequest('/jobs').then(jobs => {
        // Aplicar filtros simples
        if (filters.query) {
            const query = filters.query.toLowerCase();
            jobs = jobs.filter(job => 
                job.title.toLowerCase().includes(query) || 
                job.company.name.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query)
            );
        }
        
        if (filters.location && filters.location !== "Todas las ubicaciones") {
            jobs = jobs.filter(job => job.location.includes(filters.location));
        }

        if (filters.featured) {
            jobs = jobs.filter(job => job.featured);
        }
        
        return jobs;
    });
};

export const fetchJobDetails = (jobId) => {
    return apiRequest(`/jobs/${jobId}`);
};

export const applyToJob = (jobId) => {
    return apiRequest(`/jobs/${jobId}/apply`, 'POST');
};

export const fetchUserProfile = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    return Promise.resolve(userData);
};