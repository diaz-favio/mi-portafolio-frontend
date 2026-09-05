document.addEventListener("DOMContentLoaded", () => {
    const recoveryForm = document.getElementById("recoveryForm");
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const recoveryButton = document.getElementById("recoveryButton");
    const recoveryText = document.getElementById("recoveryText");
    const loader = document.getElementById("loader");
    const arrow = document.querySelector(".button-arrow");
    const formStatus = document.getElementById("formStatus");

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function showError(message) {
        const container = emailInput.closest(".input-container");
        container.classList.add("error");
        emailError.textContent = message;
    }

    function clearError() {
        const container = emailInput.closest(".input-container");
        container.classList.remove("error");
        emailError.textContent = "";
    }

    function setLoading(value) {
        if (value) {
            recoveryButton.disabled = true;
            recoveryText.style.display = "none";
            arrow.style.display = "none";
            loader.style.display = "block";
        } else {
            recoveryButton.disabled = false;
            recoveryText.style.display = "block";
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

    emailInput.addEventListener("input", () => {
        clearError();
        hideStatus();
    });

    recoveryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();

        clearError();
        hideStatus();

        if (!email) {
            showError("Ingresa tu correo electrónico.");
            return;
        }

        if (!validateEmail(email)) {
            showError("Ingresa un correo electrónico válido.");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            showStatus(
                "Si existe una cuenta asociada a este correo, recibirás las instrucciones para restablecer tu contraseña.",
                "success"
            );
            console.log({ email: email });
        }, 1200);
    });
});