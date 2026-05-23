import { auth } from "./firebase-config.js";

import {

  signOut

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const logoutBtn = document.querySelector("#logout-btn");


logoutBtn.addEventListener("click", () => {

  signOut(auth)

    .then(() => {

      alert("Logged Out Successfully");

      window.location.href = "login.html";

    })

    .catch((error) => {

      alert(error.message);

    });

});