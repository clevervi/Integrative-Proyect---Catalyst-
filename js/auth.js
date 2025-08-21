import { showToast } from './ui.js';
import { apiRequest } from './api.js';

export const handleAuth = () => {
    // Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            try {
                // Buscar usuario en la "base de datos"
                const users = await apiRequest('/users', "GET");
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Guardar datos de usuario
                    localStorage.setItem("userData", JSON.stringify(user));
                    localStorage.setItem("isAuthenticated", "true");
                    
                    // Actualizar UI
                    updateAuthUI();
                    showToast("¡Bienvenido! Has iniciado sesión correctamente.");
                    
                    // Cerrar modal y resetear formulario
                    $("#loginModal").modal("hide");
                    loginForm.reset();
                    
                    // Redirigir si es necesario
                    if (window.location.pathname.includes('index.html')) {
                        window.location.reload();
                    }
                } else {
                    showToast("Credenciales incorrectas", "error");
                }
            } catch (error) {
                showToast("Error de conexión", "error");
                // Datos de demostración
                if (email === "demo@catalyst.com" && password === "demo123") {
                    const demoUser = {
                        id: 999,
                        email: "demo@catalyst.com",
                        firstName: "Usuario",
                        lastName: "Demo",
                        title: "Desarrollador Full Stack"
                    };
                    localStorage.setItem("userData", JSON.stringify(demoUser));
                    localStorage.setItem("isAuthenticated", "true");
                    updateAuthUI();
                    $("#loginModal").modal("hide");
                    showToast("Modo demostración activado");
                }
            }
        });
    }

    // Registro
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("registerEmail").value;
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                showToast("Las contraseñas no coinciden", "error");
                return;
            }

            try {
                // Verificar si el usuario ya existe
                const users = await apiRequest('/users', "POST");
                if (users.find(u => u.email === email)) {
                    showToast("Este correo ya está registrado", "error");
                    return;
                }

                // Crear nuevo usuario
                const newUser = {
                    id: Date.now(),
                    email: email,
                    password: password,
                    firstName: document.getElementById("firstName").value,
                    lastName: document.getElementById("lastName").value,
                    title: "Nuevo usuario",
                    skills: [],
                    experience: [],
                    education: [],
                    documents: []
                };

                // En un caso real, aquí haríamos POST a /users
                // Por ahora guardamos en localStorage
                localStorage.setItem("userData", JSON.stringify(newUser));
                localStorage.setItem("isAuthenticated", "true");
                
                updateAuthUI();
                showToast("¡Cuenta creada exitosamente!");
                $("#registerModal").modal("hide");
                registerForm.reset();
            } catch (error) {
                showToast("Error en el registro", "error");
            }
        });
    }
};

export const updateAuthUI = () => {
    const authButtons = document.getElementById("auth-buttons");
    if (!authButtons) return;

    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (isAuthenticated && userData) {
        authButtons.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user-circle me-1"></i> ${userData.firstName || 'Usuario'}
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="pages/perfil.html"><i class="fas fa-user me-2"></i> Mi perfil</a></li>
                    <li><a class="dropdown-item" href="#"><i class="fas fa-heart me-2"></i> Favoritos</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><button class="dropdown-item logout-btn"><i class="fas fa-sign-out-alt me-2"></i> Cerrar sesión</button></li>
                </ul>
            </div>
        `;

        // Agregar evento de logout
        document.querySelector(".logout-btn")?.addEventListener("click", logoutUser);
    } else {
        authButtons.innerHTML = `
            <a href="index.html" class="btn btn-outline-light me-2" id="login" data-bs-toggle="modal" data-bs-target="#loginModal">
                <i class="fas fa-sign-in-alt me-1"></i> Ingresar
            </a>
            <a href="#login" class="btn btn-accent" data-bs-toggle="modal" data-bs-target="#registerModal">
                <i class="fas fa-user-plus me-1"></i> Registrarse
            </a>
        `;
    }
};

const logoutUser = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("favoriteJobs");
    updateAuthUI();
    showToast("Has cerrado sesión.");
    
    // Si estamos en una página que requiere autenticación, redirigir al inicio
    if (window.location.pathname.includes('perfil.html')) {
        window.location.href = '../index.html';
    }
};

// Verificar autenticación en páginas protegidas
export const checkAuth = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    if (!isAuthenticated && window.location.pathname.includes('perfil.html')) {
        window.location.href = '../index.html';
        return false;
    }
    
    return isAuthenticated;
};