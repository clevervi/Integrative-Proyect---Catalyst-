// Manejo de autenticación y sesión de usuario
import { showToast } from './ui.js';
import { authenticateUser, registerUser } from './api.js';

export const handleAuth = () => {
    // Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            // Obtener credenciales
            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            try {
                // Autenticar usuario
                const response = await authenticateUser(email, password);
                // Guardar token y datos de usuario
                localStorage.setItem("authToken", response.token);
                localStorage.setItem("userData", JSON.stringify(response.user));
                // Actualizar UI y mostrar feedback
                updateAuthUI();
                showToast("Bienvenido! Has iniciado sesión correctamente.");
                $("#loginModal").modal("hide");
                loginForm.reset();
            } catch (error) {
                showToast(error.message, "error");
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

            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                showToast("Las contraseñas no coinciden", "error");
                return;
            }

            try {
                const response = await registerUser({
                    email,
                    password,
                    firstName: document.getElementById("firstName").value,
                    lastName: document.getElementById("lastName").value,
                });
                localStorage.setItem("authToken", response.token);
                localStorage.setItem("userData", JSON.stringify(response.user));
                updateAuthUI();
                showToast("Registro exitoso. ¡Bienvenido a Catalyst!");
                $("#registerModal").modal("hide");
                registerForm.reset();
            } catch (error) {
                showToast(error.message, "error");
            }
        });
    }
};

export const updateAuthUI = () => {
    const authButtons = document.getElementById("auth-buttons");
    if (!authButtons) return;

    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    if (token && userData) {
        // Usuario autenticado
        authButtons.innerHTML = `
        <div class="dropdown">
            <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
        // Mostrar botones de login/registro
        authButtons.innerHTML = `
        <a href="#" class="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">
            <i class="fas fa-sign-in-alt me-1"></i> Ingresar
        </a>
        <a href="#" class="btn btn-accent" data-bs-toggle="modal" data-bs-target="#registerModal">
            <i class="fas fa-user-plus me-1"></i> Registrarse
        </a>
        `;
    }
};

const logoutUser = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("favoriteJobs");
    updateAuthUI();
    showToast("Has cerrado sesión.");
    window.location.href = 'index.html'; // Redirigir a la página de inicio
};