const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Function to display toast notifications
function showToast(message, isError = false) {
  toastMessage.textContent = message;
  toast.classList.add('visible');
  toast.classList.toggle('error', isError);
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3000);
}

// Fetch tasks from the backend and display them
async function fetchTasks() {
  try {
    const response = await fetch("/api/v1/task-list");
    const data = await response.json();

    if (data.success) {
      displayTasks(data.data);
    } else {
      showToast("Failed to fetch tasks", true);
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
    showToast("Failed to fetch tasks", true);
  }
}

// Display tasks in the UI
function displayTasks(tasks) {
  taskList.innerHTML = ''; // Clear existing tasks
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.classList.toggle('completed', task.isCompleted);
    taskItem.innerHTML = `
      <span>${task.taskName} - ${task.taskDescription} (${task.taskDate})</span>
      <div>
        <button class="complete-btn" onclick="markTaskComplete('${task._id}')">Complete</button>
        <button class="delete-btn" onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Handle task creation
taskForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const taskName = document.getElementById('taskName').value;
  const taskDescription = document.getElementById('taskDescription').value;
  const taskDate = document.getElementById('taskDate').value;

  try {
    const response = await fetch('/api/v1/create-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskName, taskDescription, taskDate })
    });
    const data = await response.json();

    if (data.success) {
      showToast('Task created successfully');
      fetchTasks(); // Refresh task list
      taskForm.reset(); // Clear form
    } else {
      showToast('Failed to create task', true);
    }
  } catch (error) {
    console.error('Error creating task:', error);
    showToast('Error creating task', true);
  }
});

// Mark task as complete
async function markTaskComplete(taskId) {
  try {
    const response = await fetch(`/api/v1/update-task/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: true })
    });
    const data = await response.json();

    if (data.success) {
      showToast('Task marked as complete');
      fetchTasks();
    } else {
      showToast('Failed to complete task', true);
    }
  } catch (error) {
    console.error('Error completing task:', error);
    showToast('Error completing task', true);
  }
}

// Delete task
async function deleteTask(taskId) {
  try {
    const response = await fetch(`/api/v1/delete-task/${taskId}`, { method: 'DELETE' });
    const data = await response.json();

    if (data.success) {
      showToast('Task deleted successfully');
      fetchTasks();
    } else {
      showToast('Failed to delete task', true);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    showToast('Error deleting task', true);
  }
}

// Fetch tasks when page loads
fetchTasks();
