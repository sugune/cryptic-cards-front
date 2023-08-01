import { TokenStorage, Request, Theme, authUrl } from "./utility.js";

const login = document.querySelector(".login");
const register = document.querySelector(".register");
const overlay = document.querySelector(".black-overlay");
const loginBtn = document.querySelector(".login-btn");
const registerBtn = document.querySelector(".register-btn");
const eyes = document.querySelectorAll(".fa-eye");

// register elements
const registerForm = document.querySelector(".register-form");
const registerPasswordInput = document.querySelector(
  ".register-password-input"
);
const registerEmailInput = document.querySelector(".register-email-input");
const registerUsernameInput = document.querySelector(
  ".register-username-input"
);
const registerSubmitBtn = document.querySelector(".register-submit-btn");

// login elements
const loginForm = document.querySelector(".login-form");
const loginEmailInput = document.querySelector(".login-email-input");
const loginPasswordInput = document.querySelector(".login-password-input");
const loginSubmitBtn = document.querySelector(".login-submit-btn");

class UI {
  formFunctionality() {
    registerForm.addEventListener("click", this.formCB);
    loginForm.addEventListener("click", this.formCB);

    this.showPassword();

    loginBtn.addEventListener("click", () => {
      login.classList.toggle("show-login-register");
      register.classList.remove("show-login-register");
      overlay.classList.add("show-overlay");
      if (!login.classList.contains("show-login-register")) {
        overlay.classList.remove("show-overlay");
      }
    });

    registerBtn.addEventListener("click", () => {
      register.classList.toggle("show-login-register");
      login.classList.remove("show-login-register");
      overlay.classList.add("show-overlay");

      if (!register.classList.contains("show-login-register")) {
        overlay.classList.remove("show-overlay");
      }
    });
  }

  formCB = async (e) => {
    e.preventDefault();

    if (e.target.matches("button")) {
      let data = {};
      let url = "";
      let form = "";

      if (e.target.matches(".register-submit-btn")) {
        const password = registerPasswordInput.value;
        const email = registerEmailInput.value;
        const username = registerUsernameInput.value;

        data = { username, email, password };
        url = `${authUrl}register`;
        form = "register";
      }

      if (e.target.matches(".login-submit-btn")) {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        data = { email, password };
        url = `${authUrl}login`;
        form = "login";
      }

      const res = await Request.postReq(url, data);

      // handling errors

      const errorMessage = res.hasOwnProperty("response")
        ? res.response.data.message
        : "";
     
      let formInput = "";
      const regexEmail = /email/i;
      const regexPassword = /password/i;
      const regexUsername = /username/i;

      if (form === "login" && errorMessage) {
      
        if (regexEmail.test(errorMessage)) {
          formInput = loginEmailInput;
        } else if (regexPassword.test(errorMessage)) {
          formInput = loginPasswordInput;
        }
        this.displayError(errorMessage, formInput);
      }

      if (form === "register" && errorMessage) {
        if (regexEmail.test(errorMessage)) {
          this.displayError(errorMessage, registerEmailInput);
        }

        const splitMessage = errorMessage.split(",");
        if (splitMessage[splitMessage.length - 1] === "V") {
          const messages = errorMessage.split(",");
          for (let i = 0; i < messages.length - 1; i++) {
            if (regexEmail.test(messages[i])) {
              this.displayError(messages[i], registerEmailInput);
            }
            if (regexPassword.test(messages[i])) {
              this.displayError(messages[i], registerPasswordInput);
            }
            if (regexUsername.test(messages[i])) {
              this.displayError(messages[i], registerUsernameInput);
            }
          }
        }
      }

      // if (errorStatus === 400 && errorMessage[i].toLowerCase() === 'email') {
      //   this.displayError(errorMessage.join(' '), loginEmailInput);
      //   return
      // } else if (errorStatus === 400 && errorMessage[i].toLowerCase() === 'password') {
      //   this.displayError(errorMessage.join(' '), loginPasswordInput);
      //   return
      // } else if (errorStatus === 400 && errorMessage[0].toLowerCase() === 'email') {
      //   this.displayError(errorMessage.join(' '), registerEmailInput);
      //   return
      // } else if (errorStatus === 401 && errorMessage[i].toLowerCase() === 'email') {
      //   this.displayError(errorMessage.join(' '), loginEmailInput);
      //   return
      // } else if (errorStatus === 401 && errorMessage[i].toLowerCase() === 'password') {
      //   this.displayError(errorMessage.join(' '), loginPasswordInput);
      //   return
      // }

      const token = res.data.token;
      
      localStorage.setItem("username", res.data.username);
      if (token) {
        TokenStorage.saveToken(token);
        window.location.href = "./pages/home.html";
      }
    }
  };

  displayError(message, element) {
    const parent = element.parentNode;
    let error = parent.lastElementChild;
    if (element === loginPasswordInput) {
      error = element.parentNode.parentNode.lastElementChild;
    }
    if (element === registerPasswordInput) {
      error = element.parentNode.parentNode.lastElementChild;
    }
   
    error.classList.add("error");
    error.innerHTML = message;

    setTimeout(function () {
      error.classList.remove("error");
    }, 2000);
    return;
  }

  showPassword() {
    eyes.forEach((eye) => {
      let state = true;
      eye.addEventListener("click", () => {
        eye.classList.toggle("active-eye");
        if (state) {
          eye.previousSibling.previousSibling.setAttribute("type", "text");
          state = false;
          return;
        }
        if (!state) {
          eye.previousSibling.previousSibling.setAttribute("type", "password");
          state = true;
        }
      });
    });
  }

  setMainHeight() {
    const headerHeight = document.querySelector(".header").offsetHeight;
    const windowHeight = window.innerHeight;
    const mainHeight = windowHeight - headerHeight;
    document
      .querySelector("body")
      .style.setProperty("--main-height", `${mainHeight}px`);
  }

  setTheme(themeProperties) {
    const root = document.documentElement;
    const sectionLogo = document.querySelector(".section-image img");

    sectionLogo.src = `./assets/logos/${themeProperties.bigLogo}`;

    root.style.setProperty("--primary-color", themeProperties.primaryColor);
    root.style.setProperty("--secondary-color", themeProperties.secondaryColor);
    root.style.setProperty(
      "--background-color-500",
      themeProperties.background500
    );
    root.style.setProperty(
      "--background-color-400",
      themeProperties.background400
    );
    root.style.setProperty(
      "--background-color-300",
      themeProperties.background300
    );
    root.style.setProperty(
      "--background-color-300-0",
      themeProperties.background3000
    );
    root.style.setProperty("--light-color-500", themeProperties.lightColor500);
    root.style.setProperty("--light-color-600", themeProperties.lightColor600);
    root.style.setProperty("--light-color-700", themeProperties.lightColor700);
  }
}

window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    location.reload();
  }
});

window.addEventListener("load", () => {
  const ui = new UI();
  ui.setMainHeight();
});
window.addEventListener("resize", () => {
  const ui = new UI();
  ui.setMainHeight();
});

window.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("deckId");
  localStorage.removeItem("username");
  localStorage.removeItem("token");

  if (!Theme.getTheme()) Theme.setTheme();
  const themeProperties = Theme.getTheme();

  const ui = new UI();
  ui.setTheme(themeProperties);
  ui.formFunctionality();
});
