const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');

window.onload = function () {
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

function createTask(taskText, isCompleted, deadline) {
  const taskItem = document.createElement('li');
  taskItem.classList.add('task');

  const checkBox = document.createElement('input');
  checkBox.type = 'checkbox';
  checkBox.addEventListener('change', () =>
    toggleTaskStatus(taskTextSpan, checkBox)
  );
  checkBox.checked = isCompleted;

  const taskTextSpan = document.createElement('span');
  taskTextSpan.textContent = taskText;
  taskTextSpan.addEventListener('click', () =>
    toggleTaskStatusByText(taskTextSpan, checkBox)
  );

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'Видалити';
  deleteButton.addEventListener('click', () => deleteTask(taskItem));

  const deadlineButton = document.createElement('button');
  deadlineButton.textContent = deadline;
  deadlineButton.classList.add('deadline-button');
  deadlineButton.addEventListener('click', () =>
    showCalendar(taskItem, deadlineButton)
  );

  const editButton = document.createElement('button');
  editButton.classList.add('edit-button');
  editButton.textContent = 'Редагувати';
  editButton.addEventListener('click', () => editTask(taskTextSpan));

  taskItem.appendChild(checkBox);
  taskItem.appendChild(taskTextSpan);
  taskItem.appendChild(deleteButton);
  taskItem.appendChild(editButton);
  taskItem.appendChild(deadlineButton);

  taskList.appendChild(taskItem);

  taskInput.value = '';
  addButton.disabled = true;
  saveTasksToLocalStorage();
}

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    createTask(taskText, false, 'Дедлайн');
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

function showCalendar(taskItem, deadlineButton) {
  const calendarInput = document.createElement('input');
  calendarInput.type = 'date';

  taskItem.appendChild(calendarInput);
  calendarInput.focus();

  calendarInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const selectedDate = calendarInput.value;
      if (selectedDate) {
        const formattedDate = formatDate(selectedDate);
        const timeRemaining = calculateTimeRemaining(selectedDate);
        deadlineButton.textContent = `${formattedDate} (${timeRemaining})`;
        taskItem.removeChild(calendarInput);
        deadlineButton.style.display = 'block';
        saveTasksToLocalStorage();
      }
    }
  });

  deadlineButton.style.display = 'none';
  taskItem.appendChild(deadlineButton);
}

function calculateTimeRemaining(selectedDate) {
  const deadline = new Date(selectedDate);
  const now = new Date();

  const timeDiff = deadline - now;
  const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

  if (daysRemaining === 0) {
    return 'Сьогодні';
  } else if (daysRemaining === 1) {
    return 'Завтра';
  } else if (daysRemaining > 1) {
    return `Через ${daysRemaining} дні(в)`;
  } else {
    return 'Прострочено';
  }
}

function formatDate(dateString) {
  const dateObject = new Date(dateString);
  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const year = dateObject.getFullYear();

  return `${day}-${month}-${year}`;
}

function editTask(taskTextSpan) {
  const previousText = taskTextSpan.textContent;
  const editTextInput = document.createElement('input');
  editTextInput.type = 'text';
  editTextInput.value = taskTextSpan.textContent;
  editTextInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      if (editTextInput.value.trim() !== '') {
        taskTextSpan.textContent = editTextInput.value;
      } else {
        taskTextSpan.textContent = previousText;
      }
      saveTasksToLocalStorage();
    }
  });

  taskTextSpan.textContent = '';
  taskTextSpan.appendChild(editTextInput);
  editTextInput.focus();
}

function saveTasksToLocalStorage() {
  const tasks = [];
  const taskItems = document.querySelectorAll('#taskList li');

  taskItems.forEach((taskItem) => {
    const taskText = taskItem.querySelector('span').textContent;
    const isTaskCompleted = taskItem.querySelector(
      'input[type="checkbox"]'
    ).checked;

    const taskDeadline = taskItem.querySelector(
      'button.deadline-button'
    ).textContent;

    tasks.push({
      text: taskText,
      completed: isTaskCompleted,
      deadline: taskDeadline,
    });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  const tasksJSON = localStorage.getItem('tasks');

  if (tasksJSON) {
    const tasks = JSON.parse(tasksJSON);
    tasks.forEach((task) => {
      createTask(task.text, task.completed, task.deadline);
    });
  }
}
