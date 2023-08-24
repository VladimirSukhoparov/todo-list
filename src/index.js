import "./style.css";
const list = document.getElementById("list");
const btn_create = document.getElementById("create");
const btn_even = document.getElementById("even");
const btn_uneven = document.getElementById("uneven");
const btn_last = document.getElementById("last");
const btn_first = document.getElementById("first");

let todos = [];

btn_create.addEventListener("click", CreateNewTodo);

btn_uneven.addEventListener("click", () => {
  for (let i = 0; i < list.childNodes.length; i += 2) {
    list.childNodes[i].classList.toggle("color");
  }
});

btn_even.addEventListener("click", () => {
  for (let i = 1; i < list.childNodes.length; i += 2) {
    list.childNodes[i].classList.toggle("color");
  }
});

btn_last.addEventListener("click", () => {
  let lastEl = todos.pop();
  todos = todos.filter((el) => el.id != lastEl.id);
  Save();
  list.lastElementChild.remove();
});

btn_first.addEventListener("click", () => {
  let firstEl = todos.shift();
  todos = todos.filter((el) => el.id != firstEl.id);
  Save();
  list.firstElementChild.remove();
});

function CreateNewTodo() {
  const todo = {
    id: new Date().getTime(),
    text: "",
    complete: false,
  };

  todos.unshift(todo);

  const { item_el, input_el } = CreateTodoElement(todo);
  list.prepend(item_el);
  input_el.removeAttribute("disabled");
  input_el.focus();

  Save();
}

function CreateTodoElement(item) {
  const item_el = document.createElement("div");
  item_el.classList.add("item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = item.complete;
  checkbox.addEventListener("click", () => {
    if (checkbox.checked) {
      item_el.classList.add("complete");
      todos = todos.filter((t) => t.id != item.id);
      todos.push(item);
      Save();
      item_el.remove();
      list.append(item_el);
      checkbox.disabled = "true";
    }
  });
  if (item.complete) {
    item_el.classList.add("complete");
    checkbox.disabled = "true";
  }

  const input_el = document.createElement("input");
  input_el.type = "text";
  input_el.value = item.text;
  input_el.setAttribute("disabled", "");

  const actions_el = document.createElement("div");
  actions_el.classList.add("actions");

  const btn_remove = document.createElement("button");
  btn_remove.classList.add("remove-btn");
  btn_remove.innerText = "remove";

  actions_el.append(btn_remove);

  item_el.append(checkbox);
  item_el.append(input_el);
  item_el.append(actions_el);

  checkbox.addEventListener("change", () => {
    item.complete = checkbox.checked;

    if (item.complete) {
      item_el.classList.add("complete");
    } else {
      item_el.classList.remove("complete");
    }

    Save();
  });

  input_el.addEventListener("input", () => {
    item.text = input_el.value;
  });

  input_el.addEventListener("blur", () => {
    input_el.setAttribute("disabled", "");
    Save();
  });

  input_el.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      input_el.setAttribute("disabled", "");
      Save();
    }
  });

  btn_remove.addEventListener("click", () => {
    todos = todos.filter((t) => t.id != item.id);

    item_el.remove();

    Save();
  });

  return { item_el, input_el, btn_remove };
}

function DisplayTodos() {
  list.innerHTML = "";
  Load();

  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const { item_el } = CreateTodoElement(item);
    list.append(item_el);
  }
}

DisplayTodos();

function Save() {
  const save = JSON.stringify(todos);
  localStorage.setItem("todos", save);
}

function Load() {
  const data = localStorage.getItem("todos");
  if (data) {
    todos = JSON.parse(data);
  }
}
