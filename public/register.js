// Обробник події для форми реєстрації
document
    .getElementById("registerForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        // Отримуємо значення з форми
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const messageElement = document.getElementById("message");

        if (password.length < 6) {
            messageElement.textContent =
                "Пароль повинен містити мінімум 6 символів.";
            messageElement.style.color = "red";
            return;
        }

        // Перевірка формату email
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            messageElement.textContent = "Невірний формат email.";
            messageElement.style.color = "red";
            return;
        }

        try {
            // Відправка даних на сервер для реєстрації
            const response = await fetch("http://localhost:5000/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            // Виведення результату реєстрації
            if (response.ok) {
                messageElement.textContent = data.message;
                messageElement.style.color = "green";
            } else {
                messageElement.textContent = data.message;
                messageElement.style.color = "red";
            }
        } catch (error) {
            console.error("Помилка при реєстрації:", error);
            messageElement.textContent = "Сталася помилка при реєстрації.";
            messageElement.style.color = "red";
        }
    });
