document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const name = document.getElementById("name");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");
    const registerButton = document.getElementById("registerButton");
    const registerText = document.getElementById("registerText");
    const loader = document.getElementById("loader");
    const arrow = document.querySelector(".button-arrow");
    const formStatus = document.getElementById("formStatus");

    const toggleButtons = document.querySelectorAll(".toggle-password");

    toggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.target;
            const input = document.getElementById(targetId);
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            button.setAttribute("aria-label", isPassword ? "Ocultar contraseña" : "Mostrar contraseña");
        });
    });

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function isValidPhone(value) {
        return /^[0-9\s+()-]{7,15}$/.test(value);
    }

    function showError(input, errorId, message) {
        const container = input.closest(".input-container");
        container.classList.add("error");
        document.getElementById(errorId).textContent = message;
    }

    function clearError(input, errorId) {
        const container = input.closest(".input-container");
        container.classList.remove("error");
        document.getElementById(errorId).textContent = "";
    }

    const strengthBars = document.querySelectorAll(".strength-bars span");
    const strengthText = document.getElementById("strengthText");

    function updatePasswordStrength(value) {
        let strength = 0;

        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[^A-Za-z0-9]/.test(value)) strength++;

        const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

        strengthBars.forEach((bar, index) => {
            bar.style.background = index < strength ? colors[strength - 1] : "#e5e7eb";
        });

        if (!value) {
            strengthText.textContent = "Seguridad de contraseña";
            return;
        }

        const messages = ["Muy débil", "Débil", "Buena", "Muy segura"];
        strengthText.textContent = messages[strength - 1] || "Muy débil";
    }

    password.addEventListener("input", () => {
        updatePasswordStrength(password.value);
    });

    const fields = [
        [name, "nameError"],
        [lastName, "lastNameError"],
        [email, "emailError"],
        [phone, "phoneError"],
        [password, "passwordError"],
        [confirmPassword, "confirmPasswordError"]
    ];

    fields.forEach(([input, errorId]) => {
        input.addEventListener("input", () => {
            clearError(input, errorId);
            hideStatus();
        });
    });

    terms.addEventListener("change", () => {
        document.getElementById("termsError").textContent = "";
    });

    function setLoading(value) {
        if (value) {
            registerButton.disabled = true;
            registerText.style.display = "none";
            arrow.style.display = "none";
            loader.style.display = "block";
        } else {
            registerButton.disabled = false;
            registerText.style.display = "block";
            arrow.style.display = "block";
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

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nameValue = name.value.trim();
        const lastNameValue = lastName.value.trim();
        const emailValue = email.value.trim();
        const phoneValue = phone.value.trim();
        const passwordValue = password.value;
        const confirmValue = confirmPassword.value;
        let valid = true;

        if (nameValue.length < 2) {
            showError(name, "nameError", "Ingresa tu nombre.");
            valid = false;
        }

        if (lastNameValue.length < 2) {
            showError(lastName, "lastNameError", "Ingresa tu apellido.");
            valid = false;
        }

        if (!emailValue) {
            showError(email, "emailError", "Ingresa tu correo.");
            valid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(email, "emailError", "Correo electrónico no válido.");
            valid = false;
        }

        if (!phoneValue) {
            showError(phone, "phoneError", "Ingresa tu teléfono.");
            valid = false;
        } else if (!isValidPhone(phoneValue)) {
            showError(phone, "phoneError", "Número no válido.");
            valid = false;
        }

        if (passwordValue.length < 8) {
            showError(password, "passwordError", "Debe tener mínimo 8 caracteres.");
            valid = false;
        }

        if (!confirmValue) {
            showError(confirmPassword, "confirmPasswordError", "Confirma tu contraseña.");
            valid = false;
        } else if (passwordValue !== confirmValue) {
            showError(confirmPassword, "confirmPasswordError", "Las contraseñas no coinciden.");
            valid = false;
        }

        if (!terms.checked) {
            document.getElementById("termsError").textContent = "Debes aceptar los términos.";
            valid = false;
        }

        if (!valid) {
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            showStatus("Cuenta creada correctamente.", "success");
            console.log({
                name: nameValue,
                lastName: lastNameValue,
                email: emailValue,
                phone: phoneValue
            });
        }, 1200);
    });
});