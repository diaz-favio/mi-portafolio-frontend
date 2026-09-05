document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const togglePassword = document.getElementById("togglePassword");
    const loginButton = document.getElementById("loginButton");
    const loginText = document.getElementById("loginText");
    const loginArrow = document.querySelector(".login-arrow");
    const loader = document.getElementById("loader");
    const formStatus = document.getElementById("formStatus");

    togglePassword.addEventListener("click", () => {
        const isPassword = passwordInput.type === "password";
        passwordInput.type = isPassword ? "text" : "password";
        togglePassword.setAttribute("aria-label", isPassword ? "Ocultar contraseña" : "Mostrar contraseña");
    });

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(input, errorElement, message) {
        const container = input.closest(".input-container");
        container.classList.add("error");
        errorElement.textContent = message;
    }

    function clearError(input, errorElement) {
        const container = input.closest(".input-container");
        container.classList.remove("error");
        errorElement.textContent = "";
    }

    emailInput.addEventListener("input", () => {
        clearError(emailInput, emailError);
        hideStatus();
    });

    passwordInput.addEventListener("input", () => {
        clearError(passwordInput, passwordError);
        hideStatus();
    });

    function setLoading(isLoading) {
        if (isLoading) {
            loginButton.disabled = true;
            loginText.style.display = "none";
            loginArrow.style.display = "none";
            loader.style.display = "block";
        } else {
            loginButton.disabled = false;
            loginText.style.display = "block";
            loginArrow.style.display = "block";
            loader.style.display = "none";
        }
    }

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
    }

    function hideStatus() {
        formStatus.textContent = "";
        formStatus.className = "form-status";
    }

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        let isValid = true;

        clearError(emailInput, emailError);
        clearError(passwordInput, passwordError);
        hideStatus();

        if (!email) {
            showError(emailInput, emailError, "Ingresa tu correo electrónico.");
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, emailError, "Ingresa un correo electrónico válido.");
            isValid = false;
        }

        if (!password) {
            showError(passwordInput, passwordError, "Ingresa tu contraseña.");
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordInput, passwordError, "La contraseña debe tener mínimo 6 caracteres.");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            showStatus("Inicio de sesión validado correctamente.", "success");
            console.log({
                email: email,
                remember: document.getElementById("remember").checked
            });
        }, 1200);
    });
});