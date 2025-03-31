//викид зі сторінки якщо немає сесії
document.addEventListener("DOMContentLoaded", async function () {
    // Перевірка статусу сесії
    const response = await fetch("http://localhost:5000/users/status");
    const data = await response.json();

    if (data.loggedIn) {
    } else {
        //редирект на сторінку входу
        window.location.href = "login.html";
    }
});

//вихід з сесії
document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        // Відправка POST запиту на сервер для виходу з сесії
        const response = await fetch("http://localhost:5000/users/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (response.ok) {
            window.location.href = "login.html";
        } else {
            alert(data.message || "Помилка при виході");
        }
    } catch (error) {
        console.error("Помилка при виході:", error);
        alert("Сталася помилка при виході.");
    }
});

document.getElementById("redirect-btn").addEventListener("click", () => {
    // Перехід на сторінку входу
    window.location.href = "login.html";
});

const API_URL = "http://localhost:5000/tasks";
let allTasks = [];

// Оновлена функція отримання всіх задач
async function fetchTasks() {
    const response = await fetch(API_URL);
    allTasks = await response.json();
    renderTasks(allTasks);
}

// Функція відображення задач
function renderTasks(tasks) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className =
            "list-group-item d-flex justify-content-between align-items-center";

        const formattedDate = task.dueDate
            ? new Date(task.dueDate).toISOString().split("T")[0]
            : "Не вказано";

        li.innerHTML = `
            <span id="task-text-${task._id}">
                <strong>${task.name}</strong> - ${task.description} <br>
                <small class="text-muted">Дата: ${formattedDate}</small>
            </span>
            <div id="task-actions-${task._id}">
                <button onclick="toggleTask('${task._id}', ${task.completed})" class="btn btn-sm ${task.completed ? "btn-success" : "btn-secondary"}">
                    <i class="bi ${task.completed ? "bi-check-lg" : "bi-x-lg"}"></i>
                </button>
                <button onclick="showEditForm('${task._id}', '${task.name}', '${task.description}', '${formattedDate}')" class="btn btn-sm btn-warning">
                    <i class="bi bi-pencil"></i>
                </button>
                <button onclick="deleteTask('${task._id}')" class="btn btn-sm btn-danger">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Функція фільтрації по даті
function filterTasks() {
    const filterDate = document.getElementById("filter-date").value;

    if (!filterDate) {
        renderTasks(allTasks); // Якщо дата не вибрана, виводимо всі задачі
        return;
    }

    const filteredTasks = allTasks.filter(
        (task) =>
            task.dueDate &&
            new Date(task.dueDate).toISOString().split("T")[0] === filterDate
    );

    renderTasks(filteredTasks);
}

//Додавання таску
async function addTask(event) {
    event.preventDefault();

    const name = document.getElementById("task-name").value;
    const description = document.getElementById("task-desc").value;
    const dueDate = document.getElementById("task-date").value; // Отримуємо дату

    if (!name || !description || !dueDate) {
        alert("Будь ласка, заповніть усі необхідні поля!");
        return;
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, dueDate }), // Додаємо dueDate
    });

    if (response.ok) {
        document.getElementById("task-form").reset();
        fetchTasks();
    } else {
        alert("Помилка при додаванні таску");
    }
}

//Відображення форми редагування
function showEditForm(id, name, description, dueDate) {
    const taskText = document.getElementById(`task-text-${id}`);
    const taskActions = document.getElementById(`task-actions-${id}`);

    taskText.innerHTML = `
        <input type="text" id="edit-name-${id}" class="form-control" value="${name}">
        <input type="text" id="edit-desc-${id}" class="form-control mt-1" value="${description}">
        <input type="date" id="edit-date-${id}" class="form-control mt-1" value="${dueDate}">
    `;

    taskActions.innerHTML = `
        <button onclick="editTask('${id}')" class="btn btn-sm btn-success">
            <i class="bi bi-save"></i> Зберегти
        </button>
        <button onclick="fetchTasks()" class="btn btn-sm btn-secondary">
            <i class="bi bi-x"></i> Скасувати
        </button>
    `;
}

//Редагування таску
async function editTask(id) {
    const name = document.getElementById(`edit-name-${id}`).value;
    const description = document.getElementById(`edit-desc-${id}`).value;
    const dueDate = document.getElementById(`edit-date-${id}`).value;

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, dueDate }),
    });

    if (response.ok) {
        fetchTasks();
    } else {
        alert("Помилка при редагуванні таску");
    }
}

// видалення таску
async function deleteTask(id) {
    if (!confirm("Ви впевнені, що хочете видалити цю задачу?")) return;

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (response.ok) {
        fetchTasks();
    } else {
        alert("Помилка при видаленні таску");
    }
}

//зміна статусу завдання
async function toggleTask(id, completed) {
    const updateResponse = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
    });

    if (updateResponse.ok) {
        fetchTasks(); // Оновлення списку
    } else {
        alert("Помилка при зміні статусу завдання");
    }
}

document.getElementById("task-form").addEventListener("submit", addTask);

fetchTasks();
