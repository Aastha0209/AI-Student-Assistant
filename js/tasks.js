import { database } from "./firebase-config.js";

import {

  ref,

  push,

  onValue,

  remove

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


const taskForm = document.querySelector("#task-form");

const taskInput = document.querySelector("#task-input");

const taskList = document.querySelector("#task-list");


// ADD TASK
taskForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const taskText = taskInput.value;

  if(taskText === "") return;

  push(ref(database, "tasks"), {

    text: taskText

  });

  taskInput.value = "";

});


// LOAD TASKS
onValue(ref(database, "tasks"), (snapshot) => {

  taskList.innerHTML = "";

  const data = snapshot.val();

  // IMPORTANT FIX
  if(data){

    for(let id in data){

      const li = document.createElement("li");

      li.innerHTML = `

        ${data[id].text}

        <button onclick="deleteTask('${id}')">
          Delete
        </button>

      `;

      taskList.appendChild(li);

    }

  }

});


// DELETE TASK
window.deleteTask = function(id){

  remove(ref(database, "tasks/" + id));

};