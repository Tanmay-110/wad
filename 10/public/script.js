document.addEventListener("DOMContentLoaded", fetchTodos);

function fetchTodos() {
  fetch('/todos')
    .then(res => res.json())
    .then(todos => {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';
      todos.forEach(todo => addToDOM(todo));
    });
}

function addToDOM(todo) {
  const li = document.createElement('li');
  li.setAttribute('data-id', todo.id);
  li.innerHTML = `
    <span class="text">${todo.text}</span>
    <button class="edit-btn" onclick="editTask(${todo.id})">Edit</button>
    <button class="delete-btn" onclick="deleteTask(${todo.id})">Delete</button>
  `;
  document.getElementById('taskList').appendChild(li);
}

function addTask() {
  const input = document.getElementById('taskInput');
  const text = input.value.trim();
  if (!text) return;

  fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
    .then(res => res.json())
    .then(todo => {
      addToDOM(todo);
      input.value = '';
    });
}

function deleteTask(id) {
  fetch(`/todos/${id}`, { method: 'DELETE' })
    .then(() => {
      document.querySelector(`[data-id='${id}']`).remove();
    });
}

function editTask(id) {
  const li = document.querySelector(`[data-id='${id}']`);
  const span = li.querySelector('.text');
  const newText = prompt("Update task:", span.textContent);
  if (newText && newText.trim()) {
    fetch(`/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText.trim() })
    })
      .then(res => res.json())
      .then(updated => {
        span.textContent = updated.text;
      });
  }
}
