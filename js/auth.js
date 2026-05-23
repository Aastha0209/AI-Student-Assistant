import { auth } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// SIGNUP
const signupForm = document.querySelector("#signup-form");

if (signupForm) {

  signupForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = signupForm.email.value;

    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)

      .then(() => {

        alert("Signup Successful");

        window.location.href = "login.html";

      })

      .catch((error) => {

        alert(error.message);

      });

  });

}


// LOGIN
const loginForm = document.querySelector("#login-form");

if (loginForm) {

  loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = loginForm.email.value;

    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)

      .then(() => {

        alert("Login Successful");

        window.location.href = "dashboard.html";

      })

      .catch((error) => {

        alert(error.message);

      });

  });

}