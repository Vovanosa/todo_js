const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

window.onload = function() {
    loadTasksFromLocalStorage();
  };

taskInput.addEventListener('input', () => {
  addButton.disabled = taskInput.value.trim() === '';
});

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

function createTask(taskText, isCompleted){
    const taskItem = document.createElement('li');

    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.addEventListener('change', () => toggleTaskStatus(taskTextSpan, checkBox));
    checkBox.checked = isCompleted;


    const taskTextSpan = document.createElement('span');
    taskTextSpan.textContent = taskText;
    taskTextSpan.addEventListener('click', () => toggleTaskStatusByText(taskTextSpan, checkBox));
    toggleTaskStatus(taskTextSpan, checkBox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Видалити';
    deleteButton.addEventListener('click', () => deleteTask(taskItem));

    taskItem.appendChild(checkBox);
    taskItem.appendChild(taskTextSpan);
    taskItem.appendChild(deleteButton);

    taskList.appendChild(taskItem);

    taskInput.value = '';
    addButton.disabled = true;
    saveTasksToLocalStorage();
}

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText !== '') {
    createTask(taskText, false);
  }
}

function toggleTaskStatus(taskItem, checkBox) {
    const isTaskCompleted = checkBox.checked;
    taskItem.style.textDecoration = isTaskCompleted ? 'line-through' : 'none';
    checkBox.checked = isTaskCompleted;
    saveTasksToLocalStorage();
}

function toggleTaskStatusByText(taskItem, checkBox) {
    checkBox.checked = !checkBox.checked;
    taskItem.style.textDecoration = checkBox.checked ? 'line-through' : 'none';
    saveTasksToLocalStorage();
  }

function deleteTask(taskItem) {
    taskList.removeChild(taskItem);
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    const tasks = [];
    const taskItems = document.querySelectorAll('#taskList li');

    taskItems.forEach((taskItem) => {
        const taskText = taskItem.querySelector('span').textContent;
        const isTaskCompleted = taskItem.querySelector('input[type="checkbox"]').checked;

        tasks.push({ text: taskText, completed: isTaskCompleted });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasksJSON = localStorage.getItem('tasks');

    if (tasksJSON) {
        const tasks = JSON.parse(tasksJSON);
        tasks.forEach((task) => {
            createTask(task.text, task.completed);
        });
    }
}