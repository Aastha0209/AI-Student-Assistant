import { database, auth } from "./firebase-config.js";

import {
  ref,
  get,
  remove,
  push,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ELEMENTS

const totalUsers =
document.getElementById("total-users");

const totalTasks =
document.getElementById("total-tasks");

const totalNotes =
document.getElementById("total-notes");

const totalAttendance =
document.getElementById("total-attendance");

const usersTable =
document.getElementById("users-table");

const activeStudent =
document.getElementById("active-student");

const lastUser =
document.getElementById("last-user");

const searchUser =
document.getElementById("search-user");

const announcementForm =
document.getElementById("announcement-form");

const announcementInput =
document.getElementById("announcement-input");

const announcementList =
document.getElementById("announcement-list");


let allUsers = [];


// ADMIN SECURITY

onAuthStateChanged(auth, (user) => {

  if (!user) {

    window.location.href =
    "login.html";

    return;

  }

  if (user.email !== "admin@gmail.com") {

    alert("Access Denied");

    window.location.href =
    "dashboard.html";

    return;

  }

  loadAdminData();

});



// LOAD ADMIN DATA

async function loadAdminData() {

  let userCount = 0;

  let taskCount = 0;

  let noteCount = 0;

  let attendanceCount = 0;

  let highestTasks = 0;

  let mostActiveName = "N/A";



  // USERS

  const usersSnapshot =
  await get(
    ref(database, "users")
  );

  if (usersSnapshot.exists()) {

    const users =
    usersSnapshot.val();

    const userIds =
    Object.keys(users);

    userCount =
    userIds.length;

    allUsers = [];



    const lastUid =
    userIds[userIds.length - 1];

    if (lastUid) {

      lastUser.innerText =

      users[lastUid].name ||

      "Unknown";

    }



    for (let uid in users) {

      const user =
      users[uid];

      allUsers.push({

        uid,

        ...user

      });

    }

    renderUsers(allUsers);

  }



  // TASKS

  const tasksSnapshot =
  await get(
    ref(database, "tasks")
  );

  if (tasksSnapshot.exists()) {

    const tasks =
    tasksSnapshot.val();

    for (let uid in tasks) {

      const count =
      Object.keys(tasks[uid]).length;

      taskCount += count;



      if (count > highestTasks) {

        highestTasks = count;

        const userSnapshot =
        await get(
          ref(
            database,
            "users/" + uid
          )
        );

        if (userSnapshot.exists()) {

          mostActiveName =
          userSnapshot.val().name;

        }

      }

    }

  }



  // NOTES

  const notesSnapshot =
  await get(
    ref(database, "notes")
  );

  if (notesSnapshot.exists()) {

    const notes =
    notesSnapshot.val();

    for (let uid in notes) {

      noteCount +=

      Object.keys(
        notes[uid]
      ).length;

    }

  }



  // ATTENDANCE

  const attendanceSnapshot =
  await get(
    ref(database, "attendance")
  );

  if (attendanceSnapshot.exists()) {

    const attendance =
    attendanceSnapshot.val();

    for (let uid in attendance) {

      attendanceCount +=

      Object.keys(
        attendance[uid]
      ).length;

    }

  }



  totalUsers.innerText =
  userCount;

  totalTasks.innerText =
  taskCount;

  totalNotes.innerText =
  noteCount;

  totalAttendance.innerText =
  attendanceCount;

  activeStudent.innerText =
  mostActiveName;

  // =======================
// ANNOUNCEMENTS
// =======================

if (announcementForm) {

  announcementForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const message =
      announcementInput.value.trim();

      if (!message) return;

      const newAnnouncement =
      push(
        ref(database, "announcements")
      );

      await set(
        newAnnouncement,
        {
          message: message,
          createdAt: Date.now()
        }
      );

      announcementInput.value = "";

      alert(
        "Announcement Posted"
      );

    }
  );

  onValue(

    ref(database, "announcements"),

    (snapshot) => {

      announcementList.innerHTML = "";

      if (!snapshot.exists()) {

        announcementList.innerHTML =

        "<li>No announcements yet</li>";

        return;

      }

      const data =
      snapshot.val();

      const announcements =
      Object.entries(data).reverse();

      announcements.forEach(([id, item]) => {

        const li =
        document.createElement("li");

        li.innerHTML = `

          ${item.message}

          <button
            onclick="deleteAnnouncement('${id}')">
            Delete
          </button>

        `;

        announcementList.appendChild(li);

      });

    }

  );

}



  createCharts(

    userCount,
    taskCount,
    noteCount,
    attendanceCount

  );

}



// RENDER USERS

function renderUsers(users) {

  usersTable.innerHTML = "";

  users.forEach((user) => {

    const row =
    document.createElement("tr");

    row.innerHTML = `

      <td>${user.name || "-"}</td>

      <td>${user.email || "-"}</td>

      <td>${user.course || "-"}</td>

      <td>${user.college || "-"}</td>

      <td>

        <button
        onclick="deleteUser('${user.uid}')">

          Delete

        </button>

      </td>

    `;

    usersTable.appendChild(row);

  });

}



// SEARCH USERS

if (searchUser) {

  searchUser.addEventListener(

    "keyup",

    () => {

      const value =
      searchUser.value
      .toLowerCase();

      const filtered =
      allUsers.filter(user =>

        (user.name || "")
        .toLowerCase()
        .includes(value)

        ||

        (user.email || "")
        .toLowerCase()
        .includes(value)

      );

      renderUsers(filtered);

    }

  );

}



// DELETE USER

window.deleteUser =
async function(uid) {

  const confirmDelete =
  confirm(
    "Delete this user?"
  );

  if (!confirmDelete)
  return;



  try {

    await remove(
      ref(
        database,
        "users/" + uid
      )
    );

    await remove(
      ref(
        database,
        "tasks/" + uid
      )
    );

    await remove(
      ref(
        database,
        "notes/" + uid
      )
    );

    await remove(
      ref(
        database,
        "attendance/" + uid
      )
    );

    alert(
      "User Deleted Successfully"
    );

    location.reload();

  }

  catch(error){

    console.log(error);

    alert(
      "Delete Failed"
    );

  }

};
window.deleteAnnouncement =
async function(id){

  const confirmDelete =
  confirm(
    "Delete this announcement?"
  );

  if(!confirmDelete)
  return;

  await remove(

    ref(
      database,
      "announcements/" + id
    )

  );

};


// CHARTS

function createCharts(

  users,
  tasks,
  notes,
  attendance

) {

  // PIE CHART

  new Chart(

    document.getElementById(
      "usersChart"
    ),

    {

      type: "pie",

      data: {

        labels: [

          "Users",
          "Tasks",
          "Notes"

        ],

        datasets: [{

          data: [

            users,
            tasks,
            notes

          ],

          backgroundColor: [

            "#3b82f6",
            "#22c55e",
            "#f59e0b"

          ]

        }]

      }

    }

  );



  // BAR CHART

  new Chart(

    document.getElementById(
      "activityChart"
    ),

    {

      type: "bar",

      data: {

        labels: [

          "Attendance",
          "Tasks",
          "Notes"

        ],

        datasets: [{

          label:
          "Platform Activity",

          data: [

            attendance,
            tasks,
            notes

          ],

          backgroundColor: [

            "#8b5cf6",
            "#ef4444",
            "#06b6d4"

          ]

        }]

      },

      options: {

        responsive: true,

        scales: {

          y: {

            beginAtZero: true

          }

        }

      }

    }

  );

}