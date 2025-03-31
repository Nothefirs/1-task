// Обробка форми входу
document
    .getElementById("loginForm")
    .addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const messageElement = document.getElementById("message");

        try {
            // Відправка даних на сервер для входу
            const response = await fetch("http://localhost:5000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                messageElement.textContent = data.message;
                messageElement.style.color = "green";

                window.location.href = "index.html";
            } else {
                messageElement.textContent = data.message;
                messageElement.style.color = "red";
            }
        } catch (error) {
            console.error("Помилка при вході:", error);
            messageElement.textContent = "Сталася помилка при вході.";
            messageElement.style.color = "red";
        }
    });

// Перевірка статусу сесії
document
    .getElementById("checkStatusButton")
    .addEventListener("click", async function () {
        const statusMessage = document.getElementById("statusMessage");

        try {
            const response = await fetch("http://localhost:5000/users/status");
            const data = await response.json();

            if (data.loggedIn) {
                statusMessage.textContent = `Ви увійшли як ${data.user.username}.`;
                statusMessage.style.color = "green";
            } else {
                statusMessage.textContent = "Ви не увійшли в систему.";
                statusMessage.style.color = "red";
            }
        } catch (error) {
            console.error("Помилка при перевірці статусу:", error);
            statusMessage.textContent =
                "Сталася помилка при перевірці статусу.";
            statusMessage.style.color = "red";
        }
    });

// Вихід з системи
document
    .getElementById("logoutButton")
    .addEventListener("click", async function () {
        const logoutMessage = document.getElementById("logoutMessage");

        try {
            const response = await fetch("http://localhost:5000/users/logout", {
                method: "POST",
            });

            const data = await response.json();

            if (response.ok) {
                logoutMessage.textContent = data.message;
                logoutMessage.style.color = "green";
            } else {
                logoutMessage.textContent = "Помилка при виході.";
                logoutMessage.style.color = "red";
            }
        } catch (error) {
            console.error("Помилка при виході:", error);
            logoutMessage.textContent = "Сталася помилка при виході.";
            logoutMessage.style.color = "red";
        }
    });
