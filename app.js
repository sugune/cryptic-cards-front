
const login = document.querySelector('.login');
const register = document.querySelector('.register');
const overlay = document.querySelector('.black-overlay');
const loginBtn = document.querySelector('.login-btn');
const registerBtn = document.querySelector('.register-btn');

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
})
