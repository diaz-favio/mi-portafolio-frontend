document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("verificationForm");
    const inputs = document.querySelectorAll(".code-input");
    const codeError = document.getElementById("codeError");
    const verificationButton = document.getElementById("verificationButton");
    const verificationText = document.getElementById("verificationText");
    const loader = document.getElementById("loader");
    const arrow = document.querySelector(".button-arrow");
    const formStatus = document.getElementById("formStatus");
    const resendButton = document.getElementById("resendButton");
    const timerElement = document.getElementById("timer");

    inputs.forEach((input, index) => {
        input.addEventListener("input", (event) => {
            let value = event.target.value.replace(/\D/g, "");
            input.value = value.slice(-1);

            if (input.value) {
                input.classList.add("filled");
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            } else {
                input.classList.remove("filled");
            }

            clearError();
            hideStatus();
        });

        input.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" && !input.value && index > 0) {
                inputs[index - 1].focus();
            }

            if (event.key === "ArrowLeft" && index > 0) {
                inputs[index - 1].focus();
            }

            if (event.key === "ArrowRight" && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });

    inputs[0].addEventListener("paste", (event) => {
        event.preventDefault();

        const pastedText = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

        if (!pastedText) {
            return;
        }

        pastedText.split("").forEach((digit, index) => {
            if (inputs[index]) {
                inputs[index].value = digit;
                inputs[index].classList.add("filled");
            }
        });

        const nextIndex = Math.min(pastedText.length, inputs.length - 1);
        inputs[nextIndex].focus();

        clearError();
    });

    function getCode() {
        return Array.from(inputs).map(input => input.value).join("");
    }

    function showError(message) {
        codeError.textContent = message;
        inputs.forEach(input => {
            input.classList.add("error");
        });
    }

    function clearError() {
        codeError.textContent = "";
        inputs.forEach(input => {
            input.classList.remove("error");
        });
    }

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
    }

    function hideStatus() {
        formStatus.textContent = "";
        formStatus.className = "form-status";
    }

    function setLoading(value) {
        if (value) {
            verificationButton.disabled = true;
            verificationText.style.display = "none";
            arrow.style.display = "none";
            loader.style.display = "block";
        } else {
            verificationButton.disabled = false;
            verificationText.style.display = "block";
            arrow.style.display = "block";
            loader.style.display = "none";
        }
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const code = getCode();

        clearError();
        hideStatus();

        if (code.length !== 6) {
            showError("Ingresa los 6 dígitos del código.");
            const firstEmpty = Array.from(inputs).find(input => !input.value);
            if (firstEmpty) {
                firstEmpty.focus();
            }
            return;
        }

        if (!/^\d{6}$/.test(code)) {
            showError("El código ingresado no es válido.");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            showStatus("Código verificado correctamente.", "success");
            console.log("Código enviado para verificar.");
        }, 1200);
    });

    let seconds = 30;
    let interval;

    function startTimer() {
        seconds = 30;
        resendButton.disabled = true;

        resendButton.innerHTML = `Reenviar en <span id="timer">${seconds}</span>s`;

        interval = setInterval(() => {
            seconds--;

            const currentTimer = document.getElementById("timer");

            if (currentTimer) {
                currentTimer.textContent = seconds;
            }

            if (seconds <= 0) {
                clearInterval(interval);
                resendButton.disabled = false;
                resendButton.textContent = "Reenviar código";
            }
        }, 1000);
    }

    resendButton.addEventListener("click", () => {
        if (resendButton.disabled) {
            return;
        }

        inputs.forEach(input => {
            input.value = "";
            input.classList.remove("filled", "error");
        });

        inputs[0].focus();

        showStatus("Se ha enviado un nuevo código de verificación.", "success");

        startTimer();
    });

    startTimer();
    inputs[0].focus();
});