import { auth, database } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  ref,
  set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ====================
// SIGNUP
// ====================

const signupForm = document.querySelector("#signup-form");

if (signupForm) {

  signupForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const fullname =
      signupForm.querySelector('input[type="text"]').value;

    const email =
      signupForm.email.value;

    const password =
      signupForm.password.value;

    createUserWithEmailAndPassword(
      auth,
      email,
      password
    )

    .then(async (userCredential) => {

  const user = userCredential.user;

  await set(
    ref(database, "users/" + user.uid),
    {
      name: fullname,
      email: email,
      role: email === "admin@gmail.com"
        ? "admin"
        : "student"
    }
  );

  alert("Signup Successful");

  window.location.href = "login.html";

})

    .catch((error) => {

      alert(error.message);

    });

  });

}



// ====================
// LOGIN
// ====================

const loginForm = document.querySelector("#login-form");

if (loginForm) {

  loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const email =
      loginForm.email.value;

    const password =
      loginForm.password.value;

    signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    .then((userCredential) => {

      const user =
        userCredential.user;

      alert("Login Successful");

      // ADMIN LOGIN
      if(user.email === "admin@gmail.com"){

        window.location.href =
        "admin.html";

      }

      // STUDENT LOGIN
      else{

        window.location.href =
        "dashboard.html";

      }

    })

    .catch((error) => {

      alert(error.message);

    });

  });

}