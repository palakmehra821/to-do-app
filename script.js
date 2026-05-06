let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  let list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    let li = document.createElement("li");

    li.draggable = true;
    li.classList.add(task.priority.toLowerCase());

    let span = document.createElement("span");
    span.textContent = task.text;

    if (task.done) span.classList.add("done");

    span.onclick = () => toggleDone(index);

    let del = document.createElement("button");
    del.textContent = "🗑";
    del.onclick = () => deleteTask(index);

    li.appendChild(span);
    li.appendChild(del);

    // Drag
    li.addEventListener("dragstart", () => {
      li.classList.add("dragging");
    });

    li.addEventListener("dragend", () => {
      li.classList.remove("dragging");
      saveOrder();
    });

    list.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  let input = document.getElementById("taskInput");
  let priority = document.getElementById("priority").value;

  if (input.value.trim() === "") return;

  tasks.push({
    text: input.value,
    done: false,
    priority: priority
  });

  input.value = "";
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;

  document.getElementById("tick").play();

  renderTasks();
}

/* Dark Mode */
function toggleMode() {
  document.body.classList.toggle("dark");
}

/* Drag Sorting */
document.getElementById("taskList").addEventListener("dragover", e => {
  e.preventDefault();
  const dragging = document.querySelector(".dragging");
  const afterElement = getDragAfterElement(e.clientY);
  const list = document.getElementById("taskList");

  if (afterElement == null) {
    list.appendChild(dragging);
  } else {
    list.insertBefore(dragging, afterElement);
  }
});

function getDragAfterElement(y) {
  const elements = [...document.querySelectorAll("li:not(.dragging)")];

  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveOrder() {
  let items = document.querySelectorAll("#taskList li span");
  let newTasks = [];

  items.forEach(item => {
    let found = tasks.find(t => t.text === item.textContent);
    if (found) newTasks.push(found);
  });

  tasks = newTasks;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();