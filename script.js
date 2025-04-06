// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTask');
const todoList = document.getElementById('todoList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// State
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    updateTaskCount();
});

addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderTodos();
    });
});

// Functionssss
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    todos.push(newTask);
    saveTodos();
    renderTodos();
    updateTaskCount();
    taskInput.value = '';
}

function toggleTask(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function deleteTask(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateTaskCount();
}

function renderTodos() {
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    todoList.innerHTML = filteredTodos.map(todo => `
        <li class="${todo.completed ? 'completed' : ''}">
            <input type="checkbox" 
                   ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTask(${todo.id})">
            <span>${todo.text}</span>
            <button class="delete-btn" onclick="deleteTask(${todo.id})">Delete</button>
        </li>
    `).join('');
}

function updateTaskCount() {
    const activeTasks = todos.filter(todo => !todo.completed).length;
    taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
} 