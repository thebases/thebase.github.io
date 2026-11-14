---
title: Make a simple todo app with Owl
description: Build a todo app with Owl in one HTML file and about 150 lines. No bundler. Add, toggle, delete and filter tasks, and save them in local storage.
date: 2026-11-14
position: 3
updated: 2026-11-14
tags: [owl, frontend, tutorial]
---

I wanted a small app to learn Owl by doing. A todo list is enough. It has state, a list, events and a child component. This post builds one from an empty folder, and it follows the official Owl tutorial.

The app will do four things: add tasks, mark them done, delete them, and filter by status.

## Step 1: set up the folder

No bundler and no install. Make four files:

```
todoapp/
  index.html
  app.css
  app.js
  owl.js
```

Download `owl.iife.js` from the [Owl releases](https://github.com/odoo/owl/releases) and rename it `owl.js`. The `iife` build runs directly in a browser. The `cjs` builds do not.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>OWL Todo App</title>
    <link rel="stylesheet" href="app.css" />
  </head>
  <body>
    <script src="owl.js"></script>
    <script src="app.js"></script>
  </body>
</html>
```

## Step 2: a first component

Put your code in `app.js`, wrapped in a function so nothing leaks into the global scope.

```js
(function () {
  const { Component, mount, xml } = owl;

  class Root extends Component {
    static template = xml`<div>todo app</div>`;
  }

  mount(Root, document.body);
})();
```

Open `index.html`. You see "todo app". A component is a class with a template. `mount` puts it in the page.

## Step 3: show a list

Each task is an object with three keys: `id`, `text` and `isCompleted`. The `id` must be unique. The text can repeat, so it cannot be the key.

```js
class Root extends Component {
  static template = xml`
    <div class="task-list">
      <t t-foreach="tasks" t-as="task" t-key="task.id">
        <div class="task">
          <input type="checkbox" t-att-checked="task.isCompleted"/>
          <span><t t-esc="task.text"/></span>
        </div>
      </t>
    </div>`;

  tasks = [
    { id: 1, text: "buy milk", isCompleted: true },
    { id: 2, text: "clean house", isCompleted: false },
  ];
}
```

`t-foreach` loops. `t-key` helps Owl match old and new rows. `t-att-checked` sets an attribute from an expression.

## Step 4: a Task child component

One piece of data should have one owner. `Root` owns the tasks. `Task` only shows one, so it gets the task as a prop.

```js
class Task extends Component {
  static template = xml`
    <div class="task" t-att-class="props.task.isCompleted ? 'done' : ''">
      <input type="checkbox" t-att-checked="props.task.isCompleted"/>
      <span><t t-esc="props.task.text"/></span>
    </div>`;
  static props = ["task"];
}
```

Add `static components = { Task };` to `Root` and use `<Task task="task"/>` in its loop. Mount with `{ dev: true }` so Owl checks props while you build. Remove it for production, because it is slower.

## Step 5: add tasks

Add an input to `Root`, and focus it when the component is mounted.

```js
setup() {
  const inputRef = useRef("add-input");
  onMounted(() => inputRef.el.focus());
  this.tasks = useState([]);
  this.nextId = 1;
}

addTask(ev) {
  if (ev.key === "Enter") {
    const text = ev.target.value.trim();
    ev.target.value = "";
    if (text) this.tasks.push({ id: this.nextId++, text, isCompleted: false });
  }
}
```

In the template: `<input placeholder="Enter a new task" t-on-keyup="addTask" t-ref="add-input"/>`.

Here is the first trap. With a plain array, the code runs but the screen does not change. Owl does not know the array changed. `useState` wraps it in a proxy, so a `push` triggers a render.

## Step 6: toggle and delete with a store

I could write toggle and delete inside the components. That scatters the logic. The tutorial moves it to a small store class instead, made reactive with `reactive`. Components read it from the environment.

```js
class TaskList {
  constructor(tasks) {
    this.tasks = tasks || [];
    const ids = this.tasks.map((t) => t.id);
    this.nextId = ids.length ? Math.max(...ids) + 1 : 1;
  }
  addTask(text) {
    text = text.trim();
    if (text) this.tasks.push({ id: this.nextId++, text, isCompleted: false });
  }
  toggleTask(task) { task.isCompleted = !task.isCompleted; }
  deleteTask(task) {
    this.tasks.splice(this.tasks.findIndex((t) => t.id === task.id), 1);
  }
}

function useStore() {
  return useState(useEnv().store);
}
```

Now `Task` calls `store.toggleTask(props.task)` and `store.deleteTask(props.task)`. The UI code and the business code are apart. You can test the store without a browser.

## Step 7: save to local storage

`reactive` takes a callback that runs when an observed value changes. Use it to save.

```js
function createTaskStore() {
  const save = () => localStorage.setItem("todoapp", JSON.stringify(store.tasks));
  const initial = JSON.parse(localStorage.getItem("todoapp") || "[]");
  const store = reactive(new TaskList(initial), save);
  save();
  return store;
}
```

Call `save()` once at the start. The proxy only watches keys it has read, and `save` reads all of them.

## Step 8: filter

Keep the filter in `Root` state and compute the visible list with a getter.

```js
setup() {
  // ...
  this.store = useStore();
  this.filter = useState({ value: "all" });
}

get displayedTasks() {
  const tasks = this.store.tasks;
  switch (this.filter.value) {
    case "active": return tasks.filter((t) => !t.isCompleted);
    case "completed": return tasks.filter((t) => t.isCompleted);
    default: return tasks;
  }
}
```

Loop over `displayedTasks` in the template. Add three clickable labels: all, active, completed. Each one sets `filter.value`.

## Step 9: start the app

```js
const env = { store: createTaskStore() };
mount(Root, document.body, { dev: true, env });
```

The finished app is under 150 lines of JavaScript, with templates. The full code and CSS are in the official [Owl todo tutorial](https://github.com/odoo/owl/blob/master/doc/learning/tutorial_todoapp.md).

## Where it breaks

- Local storage is per browser. There is no sync and no login.
- The tutorial uses `ev.keyCode`; I used `ev.key`, which is the current standard.
- It has no tests and no error handling. A real app needs both.
- I followed the tutorial and did not add new features of my own.

The thing to remember: if the screen does not update, the state is probably not wrapped in `useState` or `reactive`.
