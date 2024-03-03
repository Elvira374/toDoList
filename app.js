"use strict";

const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const taskCounter = document.querySelector('#taskCounter');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => renderTask(task));
    const children = tasksList.children;
    for (let child of children) {
        emergenceEl(child);
    }
    taskCounter.textContent = tasks.length;
}

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);


function addTask(event) {
    event.preventDefault();
    const taskText = taskInput.value;
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };
    
    tasks.push(newTask);
    
    renderTask(newTask);
    
    taskInput.value = '';
    taskCounter.textContent++;
    const lastChild = tasksList.lastElementChild;
    emergenceEl(lastChild);
    
    saveToLocalStorage();
}

function emergenceEl(elem) {
    let options = {
        threshold: [0.5]
    };
    let observer = new IntersectionObserver(onEntry, options);

    function onEntry(entry) {
        entry.forEach(change => {
            if (change.isIntersecting) {
                change.target.classList.add('element-show');
            }
        });
    }
    observer.observe(elem);
}

function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') return;
    
    
    const parentNode = event.target.closest('.list__item');
    
    const id = Number(parentNode.id);
    tasks = tasks.filter(task => task.id !== id);
    
    
    parentNode.style.transform = 'scale(0.05)';
    setTimeout(() => parentNode.remove(), 500);
    taskCounter.textContent--;
    saveToLocalStorage();
}

function doneTask(event) {
    if (event.target.dataset.action !== 'done') return;
    
    const parentNode = event.target.closest('.list__item');
    
    const id = Number(parentNode.id);
    tasks = tasks.map(task => task.id === id ? {...task, done: !task.done} : task);
    
    
    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title_done');
    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? 'task-title task-title_done' : 'task-title';
    const taskHTML = `<li id="${task.id}" class="list__item">
        <span class="${cssClass}">${task.text}</span>
        <span class="list__item__btns">
            <span data-action="done"><i class="fa-regular fa-circle-check"></i></span>
            <span data-action="delete"><i class="fa-regular fa-trash-can"></i></span>
        </span>
    </li>`;
    tasksList.insertAdjacentHTML('beforeEnd', taskHTML);
}