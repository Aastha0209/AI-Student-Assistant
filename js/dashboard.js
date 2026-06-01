import {

  database,
  auth

} from "./firebase-config.js";


import {

  ref,
  onValue

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


import {

  onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



// ELEMENTS

const dashboardTaskCount =
document.getElementById(
  "dashboard-task-count"
);


const dashboardNotesCount =
document.getElementById(
  "dashboard-notes-count"
);


const dashboardAttendance =
document.getElementById(
  "dashboard-attendance"
);



// CHART VARIABLES

let attendanceChart;

let taskChart;



// CREATE CHARTS

function createCharts(){

  attendanceChart = new Chart(

    document.getElementById(
      "attendanceChart"
    ),

    {

      type:"doughnut",

      data:{

        labels:[
          "Present",
          "Remaining"
        ],

        datasets:[{

          data:[0,100],

          backgroundColor:[

            "#2563eb",
            "#1e293b"

          ],

          borderWidth:0

        }]

      },

      options:{

        responsive:true,

        maintainAspectRatio:false,

        cutout:"70%",

        plugins:{

          legend:{

            labels:{
              color:"white"
            }

          }

        }

      }

    }

  );



  taskChart = new Chart(

    document.getElementById(
      "taskChart"
    ),

    {

      type:"bar",

      data:{

        labels:[
          "Completed",
          "Pending"
        ],

        datasets:[{

          label:"Tasks",

          data:[0,0],

          backgroundColor:[

            "#22c55e",
            "#ef4444"

          ],

          borderRadius:10

        }]

      },

      options:{

        responsive:true,

        maintainAspectRatio:false,

        plugins:{

          legend:{

            labels:{
              color:"white"
            }

          }

        },

        scales:{

          y:{

            beginAtZero:true,

            ticks:{
              color:"white"
            },

            grid:{
              color:"rgba(255,255,255,0.08)"
            }

          },

          x:{

            ticks:{
              color:"white"
            },

            grid:{
              display:false
            }

          }

        }

      }

    }

  );

}



createCharts();



// AUTH

onAuthStateChanged(auth,(user)=>{

  if(!user) return;



  // TASKS

  onValue(

    ref(
      database,
      "tasks/" + user.uid
    ),

    (snapshot)=>{

      const data =
      snapshot.val();

      let pending = 0;

      let completed = 0;



      if(data){

        for(let id in data){

          if(data[id].completed){

            completed++;

          }

          else{

            pending++;

          }

        }

      }



      dashboardTaskCount.innerText =

      pending + " Tasks";



      taskChart.data.datasets[0].data = [

        completed,
        pending

      ];

      taskChart.update();

    }

  );



  // NOTES

  onValue(

    ref(
      database,
      "notes/" + user.uid
    ),

    (snapshot)=>{

      const data =
      snapshot.val();

      let totalNotes = 0;



      if(data){

        totalNotes =

        Object.keys(data).length;

      }



      dashboardNotesCount.innerText =

      totalNotes + " Files";

    }

  );



  // ATTENDANCE

  onValue(

    ref(
      database,
      "attendance/" + user.uid
    ),

    (snapshot)=>{

      const data =
      snapshot.val();

      let totalPercentage = 0;

      let count = 0;



      if(data){

        for(let id in data){

          totalPercentage +=

          parseFloat(
            data[id].percentage
          );

          count++;

        }

      }



      let average = 0;



      if(count > 0){

        average = (

          totalPercentage / count

        ).toFixed(1);

      }



      dashboardAttendance.innerText =

      average + "%";



      attendanceChart.data.datasets[0].data = [

        average,
        100 - average

      ];



      attendanceChart.update();

    }

  );

});