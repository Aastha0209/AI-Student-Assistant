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


const attendanceForm = document.querySelector("#attendance-form");

const attendanceList = document.querySelector("#attendance-list");


let currentUser = null;


// CHECK LOGIN
onAuthStateChanged(auth, (user) => {

  if(user){

    currentUser = user;

    loadAttendance();

  }

});


// ADD ATTENDANCE
attendanceForm.addEventListener("submit", (e) => {

  e.preventDefault();

  const subject = document.querySelector("#subject-name").value;

  const attended = document.querySelector("#attended").value;

  const total = document.querySelector("#total").value;

  const percentage = ((attended / total) * 100).toFixed(1);

  push(

    ref(database, "attendance/" + currentUser.uid),

    {

      subject,

      attended,

      total,

      percentage

    }

  );

  attendanceForm.reset();

});


// LOAD ATTENDANCE
function loadAttendance(){

  onValue(

    ref(database, "attendance/" + currentUser.uid),

    (snapshot) => {

      attendanceList.innerHTML = "";

      const data = snapshot.val();

      if(data){

        for(let id in data){

          const item = data[id];

          const li = document.createElement("li");

          li.innerHTML = `

            <div>

              <strong>${item.subject}</strong>

              <br>

              ${item.attended}/${item.total}
              Lectures

              <br>

              Attendance:
              ${item.percentage}%

            </div>

            <button onclick="deleteAttendance('${id}')">
              Delete
            </button>

          `;

          attendanceList.appendChild(li);

        }

      }

    }

  );

}


// DELETE ATTENDANCE
window.deleteAttendance = function(id){

  remove(

    ref(

      database,

      "attendance/" + currentUser.uid + "/" + id

    )

  );

};