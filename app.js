let tasks = [];           // tableau des tâches
let currentFilter = "all"; // "all" | "active" | "done"

// DOM
const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const counter = document.querySelector("#counter");

const filterBtns = document.querySelectorAll(".filter-btn");
const clearDoneBtn = document.querySelector("#clearDoneBtn");
const clearAllBtn = document.querySelector("#clearAllBtn");

// LocalStorage
const STORAGE_KEY = "todo_smart_tasks_v1";

function save() {
  // TODO: sauvegarder tasks dans localStorage (JSON)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

}

function load() {
  // TODO: charger tasks depuis localStorage (JSON)
  // - si rien n’existe, garder tasks = []
  // - gérer les erreurs JSON
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (error) {
      console.error("Erreur de parsing JSON, réinitialisation des tâches");
      tasks = [];
    }
  } else {
    tasks = [];
  }
}

function getVisibleTasks() {
  // TODO: retourner la liste filtrée selon currentFilter
  // - all => toutes
  // - active => done === false
  // - done => done === true

  if (currentFilter === "active") {
    return tasks.filter(task => !task.done);
  } else if (currentFilter === "done") {
    return tasks.filter(task => task.done);
  }
      return tasks;
  }



function updateCounter() {
  // TODO: calculer le nombre de tâches non terminées
  // et mettre à jour le texte du compteur

const count = tasks.filter(task => !task.done).length;
  counter.textContent = `${count} restante${count !== 1 ? 's' : ''}`;
}

function createTaskElement(task) {
  // TODO: créer et retourner un <li> avec :
  // - class "item" (+ "done" si task.done)
  // - une checkbox liée à toggleTask(task.id)
  // - un <span class="text"> avec le texte
  // - un bouton "Supprimer" lié à deleteTask(task.id)

   const li = document.createElement("li");
  li.className = `item ${task.done ? 'done' : ''}`;
  
  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleTask(task.id));
  
  // Texte de la tâche
  const textSpan = document.createElement("span");
  textSpan.className = "text";
  textSpan.textContent = task.text;
  
  // Espaceur
  const spacer = document.createElement("span");
  spacer.className = "spacer";
  
  // Bouton supprimer
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-btn";
  deleteBtn.textContent = "Supprimer";
  deleteBtn.addEventListener("click", () => deleteTask(task.id));
  
  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(spacer);
  li.appendChild(deleteBtn);
  
  return li;

}

function render() {
  // TODO:
  // - vider taskList
  // - récupérer les tâches visibles (getVisibleTasks)
  // - pour chaque tâche visible => append createTaskElement
  // - updateCounter
   
  taskList.innerHTML = '';
  
  const visibleTasks = getVisibleTasks();
  visibleTasks.forEach(task => {
    const taskElement = createTaskElement(task);
    taskList.appendChild(taskElement);
  });
  
  updateCounter();
}

function addTask(text) {
  // TODO:
  // - trim + refuser vide
  // - créer un objet tâche { id, text, done:false }
  // - l’ajouter à tasks
  // - save() puis render()

    const trimmedText = text.trim();
  if (!trimmedText) return;
  
  const task = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    text: trimmedText,
    done: false
  };
  
  tasks.push(task);
  save();
  render();
  
  return true;


}

function toggleTask(id) {
  // TODO:
  // - retrouver la tâche par id
  // - inverser done
  // - save() puis render()


    const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    save();
    render();
  }

}

function deleteTask(id) {
  // TODO:
  // - supprimer la tâche du tableau
  // - save() puis render()

   tasks = tasks.filter(task => task.id !== id);
  save();
  render();

}

function setActiveFilterButton(activeBtn) {
  // TODO:
  // - retirer "is-active" de tous les boutons
  // - ajouter "is-active" à activeBtn

   filterBtns.forEach(btn => btn.classList.remove("is-active"));
  activeBtn.classList.add("is-active");

}

// Events
addBtn.addEventListener("click", () => {
  // TODO:
  // - addTask(taskInput.value)
  // - vider le champ + focus

     addTask(taskInput.value);
    taskInput.value = "";
    taskInput.focus();


});

taskInput.addEventListener("keydown", (e) => {
  // TODO:
  // - si e.key === "Enter" => même action que le bouton Ajouter

  if (e.key === 'Enter') {

        addTask(taskInput.value);

    // Vider le champ et remettre le focus
    taskInput.value = '';
    taskInput.focus();
  }

});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // TODO:
    // - currentFilter = btn.dataset.filter
    // - setActiveFilterButton(btn)
    // - render()

     currentFilter = btn.dataset.filter;
    setActiveFilterButton(btn);
    render();

  });
});

clearDoneBtn.addEventListener("click", () => {
  // TODO:
  // - supprimer toutes les tâches terminées
  // - save() puis render()

   tasks = tasks.filter(task => !task.done);
  save();
  render();

});

clearAllBtn.addEventListener("click", () => {
  // TODO:
  // - vider tasks
  // - save() puis render()
  tasks = [];
  save();
  render();
});

// Init
load();
render();
