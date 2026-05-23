import { database, auth } from "./firebase-config.js";

import {

  ref,

  push,

  onValue,

  remove

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const taskForm = document.querySelector("#task-form");

const taskInput = document.querySelector("#task-input");

const taskList = document.querySelector("#task-list");


let currentUser = null;


// CHECK USER LOGIN
onAuthStateChanged(auth, (user) => {

  if(user){

    currentUser = user;

    loadTasks();

  } else {

    window.location.href = "login.html";

  }

});


// ADD TASK
taskForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const taskText = taskInput.value;

  if(taskText === "") return;

  push(

    ref(database, "tasks/" + currentUser.uid),

    {

      text: taskText

    }

  );

  taskInput.value = "";

});


// LOAD USER TASKS
function loadTasks(){

  onValue(

    ref(database, "tasks/" + currentUser.uid),

    (snapshot) => {

      taskList.innerHTML = "";

      const data = snapshot.val();

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

    }

  );

}


// DELETE TASK
window.deleteTask = function(id){

  remove(

    ref(database, "tasks/" + currentUser.uid + "/" + id)

  );

};