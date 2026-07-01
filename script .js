const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const taskCount = document.getElementById("task-count");
input.addEventListener("keydown", (e) => {

    if(e.key === "Escape"){

        input.value = "";

    }

});
const filterButtons = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

// Load tasks from localStorage
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Render on page load
renderTodos();
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        renderTodos();

    });

});

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);

    saveTodos();

    input.value = "";

    renderTodos();
});

function renderTodos() {

    list.innerHTML = "";
    let filteredTodos = todos;

if (currentFilter === "active") {
    filteredTodos = todos.filter(todo => !todo.completed);
} else if (currentFilter === "completed") {
    filteredTodos = todos.filter(todo => todo.completed);
}

    if (filteredTodos.length === 0) {

        list.innerHTML = `<p class="empty">No tasks found.</p>`;

        taskCount.textContent = "Tasks Left: 0";

        return;
    }

    filteredTodos.forEach(todo => {

        const li = document.createElement("li");

        if (todo.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = todo.completed;

checkbox.addEventListener("change", () => {
    toggleComplete(todo.id);
});

        const span = document.createElement("span");
        span.className = "task";
        span.textContent = todo.text;

        span.addEventListener("click", () => {
            toggleComplete(todo.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            deleteTodo(todo.id);
        });

        li.appendChild(checkbox);
li.appendChild(span);
li.appendChild(deleteBtn);

        list.appendChild(li);

    });

    updateCounter();

}

function toggleComplete(id){

    todos = todos.map(todo => {

        if(todo.id === id){

            return {
                ...todo,
                completed: !todo.completed
            };

        }

        return todo;

    });

    saveTodos();

    renderTodos();

}

function deleteTodo(id){

    todos = todos.filter(todo => todo.id !== id);

    saveTodos();

    renderTodos();

}

function updateCounter(){

    const remainingTasks = todos.filter(todo => !todo.completed).length;

    taskCount.textContent = `Tasks Left: ${remainingTasks}`;

}

function saveTodos(){

    localStorage.setItem("todos", JSON.stringify(todos));

}