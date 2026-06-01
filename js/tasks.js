import {

  database,
  auth

} from "./firebase-config.js";


import {

  ref,
  push,
  onValue,
  remove,
  update

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


import {

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// ELEMENTS
const taskForm =
document.querySelector("#task-form");


const taskInput =
document.querySelector("#task-input");


const taskList =
document.querySelector("#task-list");


const taskCount =
document.querySelector("#task-count");


const completedCount =
document.querySelector("#completed-count");


const pendingCount =
document.querySelector("#pending-count");



let currentUser = null;




// AUTH CHECK
onAuthStateChanged(auth, (user)=>{

  if(user){

    currentUser = user;

    loadTasks();

  }

  else{

    window.location.href =
    "login.html";

  }

});




// ADD TASK
taskForm.addEventListener(
"submit",

(e)=>{

  e.preventDefault();

  const taskText =
  taskInput.value.trim();

  if(taskText === "")
  return;



  push(

    ref(
      database,
      "tasks/" + currentUser.uid
    ),

    {

      text: taskText,

      completed: false

    }

  );



  taskInput.value = "";

});





// LOAD TASKS
function loadTasks(){

  onValue(

    ref(
      database,
      "tasks/" + currentUser.uid
    ),

    (snapshot)=>{

      taskList.innerHTML = "";


      let total = 0;

      let completed = 0;

      let pending = 0;


      const data = snapshot.val();


      if(data){

        for(let id in data){

          total++;


          if(data[id].completed){

            completed++;

          }

          else{

            pending++;

          }



          const li =
          document.createElement("li");


          li.classList.add("task-item");


          li.innerHTML = `

            <div class="task-left">

              <input
                type="checkbox"
                ${data[id].completed ? "checked" : ""}
                onchange="toggleTask('${id}', ${data[id].completed})"
              >

              <span class="
              ${data[id].completed ? "completed-task" : ""}
              ">

                ${data[id].text}

              </span>

            </div>



            <button
            class="delete-task-btn"
            onclick="deleteTask('${id}')">

              Delete

            </button>

          `;


          taskList.appendChild(li);

        }

      }



      // UPDATE CARDS
      taskCount.innerText =
      total;

      completedCount.innerText =
      completed;

      pendingCount.innerText =
      pending;

    }

  );

}





// DELETE TASK
window.deleteTask = function(id){

  remove(

    ref(
      database,
      "tasks/" +
      currentUser.uid +
      "/" +
      id
    )

  );

};




// TOGGLE COMPLETE
window.toggleTask =
function(id, currentStatus){

  update(

    ref(
      database,
      "tasks/" +
      currentUser.uid +
      "/" +
      id
    ),

    {

      completed: !currentStatus

    }

  );

};