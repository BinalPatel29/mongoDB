import {apiFetch} from '../js/api.js'
        // register page
        const registerForm = document.getElementById("registerForm");
        const emailInput = document.getElementById("email");
        const passInput = document.getElementById("password");
        const errorDiv = document.getElementById("errorMessage");
        const successDiv = document.getElementById("successMessage");

        async function handlerRegister(event){
            event.preventDefault();

            errorDiv.textContent="";
            errorDiv.style.display="none";
            successDiv.textContent="";
            successDiv.style.display="none";

            const payload = {
                email: emailInput.value,
                password: passInput.value
            }

            try{
                const response = await apiFetch('/api/auth/register', {
                    method: "POST", body: JSON.stringify(payload)
                });

                if (response && response.token) {
                    localStorage.setItem("token", response.token);
                    console.log("Token saved to localStorage:", response.token);
                } else {
                    console.warn("Backend didn't return a 'token' key. Check your response object:", response);
                }

                successDiv.textContent = "Registration successful! Redirecting...";
                successDiv.style.display = "block";

                setTimeout(() => {
                    window.location.href="/frontend/index.html";
                }, 1500);
            }
            catch(error){
                errorDiv.textContent = error.message || "An unexpected error occurred.";
                errorDiv.style.display = "block";
            }
        }

        registerForm.addEventListener("submit", handlerRegister);

        // login page
        const loginForm = document.getElementById("loginForm");
        const emailInput = document.getElementById("email");
        const passInput = document.getElementById("password");
        const errorDiv = document.getElementById("errorMessage");
        const successDiv = document.getElementById("successMessage");

        async function handlerLogin(event){
            event.preventDefault();

            errorDiv.textContent="";
            errorDiv.style.display="none";
            successDiv.textContent="";
            successDiv.style.display="none";

            const payload = {
                email: emailInput.value,
                password: passInput.value
            }

            try{
                const response = await apiFetch('/api/auth/login', {
                    method: "POST", body: JSON.stringify(payload)
                });

                if (response && response.token) {
                    localStorage.setItem("token", response.token);
                    console.log("Token saved to localStorage:", response.token);
                } else {
                    console.warn("Login response did not include a token:", response);
                }

                successDiv.textContent = "Login successful! Redirecting...";
                successDiv.style.display = "block";

                setTimeout(() => {
                    window.location.href="/frontend/notes.html";
                }, 1500);
            }
            catch(error){
                errorDiv.textContent = error.message || "An unexpected error occurred.";
                errorDiv.style.display = "block";
            }
        }

        loginForm.addEventListener("submit", handlerLogin);