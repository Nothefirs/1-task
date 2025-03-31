document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("forgotEmail").value;
        const response = await fetch(
            "http://localhost:5000/users/forgot-password",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            }
        );

        const data = await response.json();
        document.getElementById("message").innerText = data.message;
    });
