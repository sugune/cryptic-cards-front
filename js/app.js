
const login = document.querySelector('.login');
const register = document.querySelector('.register');
const overlay = document.querySelector('.black-overlay');
const loginBtn = document.querySelector('.login-btn');
const registerBtn = document.querySelector('.register-btn');
const eyes = document.querySelectorAll('.fa-eye');

// register elements
const registerForm = document.querySelector('.register-form');
const registerPasswordInput = document.querySelector('.register-password-input');
const registerEmailInput = document.querySelector('.register-email-input');
const registerUsernameInput = document.querySelector('.register-username-input');
const registerSubmitBtn = document.querySelector('.register-submit-btn');

// login elements
const loginForm = document.querySelector('.login-form');
const loginEmailInput = document.querySelector('.login-email-input');
const loginPasswordInput = document.querySelector('.login-password-input');
const loginSubmitBtn = document.querySelector('.login-submit-btn');


// let JwtToken = '';

// loginBtn.addEventListener('click', () => {
//   login.classList.toggle('show-login-register');
//   register.classList.remove('show-login-register');
//   overlay.classList.add('show-overlay');
//   if (!login.classList.contains('show-login-register')) {
//     overlay.classList.remove('show-overlay');
//   }
// });

// registerBtn.addEventListener('click', () => {
//   register.classList.toggle('show-login-register');
//   login.classList.remove('show-login-register');
//   overlay.classList.add('show-overlay');
  
//   if (!register.classList.contains('show-login-register')) {
//     overlay.classList.remove('show-overlay');
//   }
// })

// registerForm.addEventListener('submit', async (e) => {
//   e.preventDefault();
  
//   const password = registerPasswordInput.value;
//   const email = registerEmailInput.value;
//   const username = registerUsernameInput.value;
//   console.log('hello')
//   console.log(password, email, username)
  
//   try {
//     const res = await axios.post('http://localhost:3000/api/v1/auth/register', {username, password, email})
//     JwtToken = res.data.token;
//     console.log(JwtToken)
//     console.log(res)
//     window.location.href = './home.html'
//   } catch (err) {
//     console.log(err);
//   }
  
// });

class UI {
  
  formFunctionality() {
    
    registerForm.addEventListener('click', this.formCB);
    loginForm.addEventListener('click', this.formCB);
    
    this.showPassword();
    
    loginBtn.addEventListener('click', () => {
      login.classList.toggle('show-login-register');
      register.classList.remove('show-login-register');
      overlay.classList.add('show-overlay');
      if (!login.classList.contains('show-login-register')) {
        overlay.classList.remove('show-overlay');
      }
    });
    
    registerBtn.addEventListener('click', () => {
      register.classList.toggle('show-login-register');
      login.classList.remove('show-login-register');
      overlay.classList.add('show-overlay');
      
      if (!register.classList.contains('show-login-register')) {
        overlay.classList.remove('show-overlay');
      }
    });
  }
  
  formCB = async (e) => {
    e.preventDefault();
    
    if (e.target.matches('button')) {
    
      let data = {}
      let url = '';
      let form = '';
      
      if (e.target.matches('.register-submit-btn')) {
        const password = registerPasswordInput.value;
        const email = registerEmailInput.value;
        const username = registerUsernameInput.value;
        
        data = {username, email, password}
        url = 'http://localhost:3000/api/v1/auth/register';
        form = 'register';
      }
      
      if (e.target.matches('.login-submit-btn')) {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        
        data = {email, password}
        url = 'http://localhost:3000/api/v1/auth/login';
        form = 'login';
      }
      console.log(data);
      
      const res = await Request.postReq(url, data);
      
      // handling errors
      const errorMessage = res.response.data.message;
      let formInput = '';
      const regexEmail = /email/i;
      const regexPassword = /password/i;
      const regexUsername = /username/i;
      console.log(res)
      
      
      if (form === 'login') {
        if (regexEmail.test(errorMessage)) {
          formInput = loginEmailInput;
        } else if (regexPassword.test(errorMessage)) {
          formInput = loginPasswordInput;
        }
        this.displayError(errorMessage, formInput);
      }
      
      if (form === 'register') {
        
        if (regexEmail.test(errorMessage)) {
          this.displayError(errorMessage, registerEmailInput);
        }
        
        const splitMessage = errorMessage.split(',');
        if (splitMessage[splitMessage.length - 1] === 'V') {
          
          const messages = errorMessage.split(',');
          for (let i = 0; i < messages.length - 1; i++) {
            if (regexEmail.test(messages[i])) {
              this.displayError(messages[i], registerEmailInput)
            }
            if (regexPassword.test(messages[i])) {
              this.displayError(messages[i], registerPasswordInput)
            }
            if (regexUsername.test(messages[i])) {
              this.displayError(messages[i], registerUsernameInput)
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
      
      console.log(res)
      const token = res.data.token;
      if (token) {
        TokenStorage.saveToken(token);
        window.location.href = './pages/home.html';
      }
      
    }
    
  }
  
  displayError(message, element) {
    const parent = element.parentNode;
    const error = parent.lastElementChild;
    console.log(error)
    error.classList.add('error');
    error.innerHTML = message;
    
    setTimeout(function() {
      error.classList.remove('error');
    }, 2000);
    return
  }
  
  showPassword() {
    
    eyes.forEach(eye => {
      let state = true;
      eye.addEventListener('click', () => {
        eye.classList.toggle('active-eye')
        if (state) {
          eye.previousSibling.previousSibling.setAttribute('type', 'text');
          state = false;
          return
        }
        if (!state) {
          eye.previousSibling.previousSibling.setAttribute('type', 'password');
          state = true;
        }
      });
    })
  }
  
  
}




class TokenStorage {
  static saveToken(token) {
    return localStorage.setItem('token', token);
  }
  
  static getToken() {
    return localStorage.getItem('token');
  }
}

class Request {
  static async getReq(url) {
    try {
      const res = await axios.get(url);
      return res;
    } catch(err) {
      return err
      console.log(err);
    }
  }
  static async getAllReq(url) {
    try {
      const res = await axios.get(url);
      return res;
    } catch(err) {
      return err
      console.log(err);
    }
  }
  static async postReq(url, data) {
    try {
      const res = await axios.post(url, data);
      return res;
    } catch(err) {
      return err
      console.log(err);
    }
  }
  static async updateReq(url) {
    try {
      const res = await axios.get(url, data);
      return res;
    } catch(err) {
      return err
      console.log(err);
    }
  }
  static async deleteReq(url) {
    try {
      const res = await axios.delete(url);
      return res;
    } catch(err) {
      return err
      console.log(err);
    }
  }
}


window.addEventListener('DOMContentLoaded', () => {
  const ui = new UI;
  ui.formFunctionality();
});
