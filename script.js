// Set initial tasks
let tasks = [];

// Select DOM elements
const taskInput = document.getElementById('task-input');
const dueDate = document.getElementById('due-date');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const totalTasksElem = document.getElementById('total-tasks');
const completedTasksElem = document.getElementById('completed-tasks');
const overdueTasksElem = document.getElementById('overdue-tasks');
const sortTasks = document.getElementById('sort-tasks');
const themeToggleButton = document.getElementById('theme-toggle');

// Function to update stats
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const overdue = tasks.filter(task => new Date(task.dueDate) < new Date() && !task.completed).length;
  totalTasksElem.textContent = total;
  completedTasksElem.textContent = completed;
  overdueTasksElem.textContent = overdue;
}

// Add task function
function addTask() {
  const taskText = taskInput.value;
  const dueDateValue = dueDate.value;

  if (taskText && dueDateValue) {
    const task = {
      text: taskText,
      dueDate: dueDateValue,
      completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
    dueDate.value = '';
  }
}

// Render tasks in the UI
function renderTasks() {
  taskList.innerHTML = '';

  // Sort tasks based on selected option
  if (sortTasks.value === 'date') {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  } else if (sortTasks.value === 'alphabetical') {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
  }

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    const taskDueDate = new Date(task.dueDate);
    const currentDate = new Date();

    li.classList.toggle('completed', task.completed);
    li.classList.toggle('overdue', taskDueDate < currentDate && !task.completed);

    li.innerHTML = `
      <span>${task.text} - Due: ${task.dueDate}</span>
      <button class="mark-complete" onclick="toggleComplete(${index})">Mark Complete</button>
      <button class="delete" onclick="deleteTask(${index})">Delete</button>
    `;
    
    taskList.appendChild(li);
  });

  updateStats();
}

// Toggle task completion
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
  renderTasks();
}

// Toggle theme
function toggleTheme() {
  document.body.classList.toggle('theme-dark');
}

// Event listeners
addTaskButton.addEventListener('click', addTask);
sortTasks.addEventListener('change', renderTasks);
themeToggleButton.addEventListener('click', toggleTheme);

// Initial load
loadTasks();
