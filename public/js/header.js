// 登入驗證
const signupTextInput = [...document.querySelectorAll('.signup-input')];
const loginTextInput = [...document.querySelectorAll('.login-input')];
// const submitBtn = document.querySelectorAll(".submit");
// const signupTextInput = [...signupInputs]
const allTextInputs = [...document.querySelectorAll('.text-input')];

// 註冊ajax
const signup = document.querySelector('.signup-btn');
const signupAccount = document.querySelector('#signup-account');
const signupPassword = document.querySelector('#signup-password');
signup.addEventListener('click', () => {
  // e.preventDefault();
  signupTextInput.forEach((x) => {
    if (x.value === '') {
      console.log(x.value);
      x.setAttribute('style', 'border: 1px solid red');
      // x.style.background = "seashell";
      // console.log(x.nextElementSibling)
      x.parentNode.nextElementSibling.setAttribute('style', 'display:block');
    }
  });
  const obj = {
    email: signupAccount.value,
    password: signupPassword.value,
  };
  fetch('/api/user/signup', {
    body: JSON.stringify(obj),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  }).then((response) => {
    console.log(response);
    if (response.status === 200) {
      console.log('註冊成功！');
      $('.signup-content').hide();
      $('.signup-success').show();
    }
    return response.json();
  });
});
// 登入ajax
const login = document.querySelector('.login-btn');
const loginAccount = document.querySelector('#login-account');
const loginPassword = document.querySelector('#login-password');

login.addEventListener('click', () => {
  // e.preventDefault();
  loginTextInput.forEach((x) => {
    if (x.value === '') {
      console.log(x);
      x.setAttribute('style', 'border: 1px solid red');
      // x.style.background = "seashell";
      // console.log(x.nextElementSibling)
      x.parentNode.nextElementSibling.setAttribute('style', 'display: block');
    }
  });
  const obj = {
    email: loginAccount.value,
    password: loginPassword.value,
  };
  fetch('/api/user/login', {
    body: JSON.stringify(obj),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
  }).then((response) => {
    // console.log(response)
    if (response.status === 200) {
      console.log('登入成功！');
    }
    // console.log(response.json())
    return response.json();
  });
});

// 驗證
allTextInputs.forEach((input) => {
  // console.log('change')
  input.addEventListener('keypress', initBorder)
  // console.log('change')
  // $(this).css('border', '1px solid #ccc');
  // e.setAttribute('style', 'border: 1px solid #ccc');
  // this.parentNode.nextElementSibling.setAttribute('style', 'display:none');
  // this.style.backgroundColor = "#fff";
  // this.style.border = "1px solid #ccc";
});
function initBorder() {
  this.setAttribute('style', 'border: 1px solid #ccc');
  this.parentNode.nextElementSibling.setAttribute('style', 'display:none');
}
// 光箱開關
document.querySelector('.navbar-btn').addEventListener('click', () => {
  document.querySelector('.bg-model').style.display = 'flex';
});
const closeModels = document.querySelectorAll('.close-model');
const models = [...closeModels];
models.forEach((x) => {
  x.addEventListener('click', () => {
    $('.bg-model').css('display', 'none');
  });
});

$('.toggle-login').click((e) => {
  e.preventDefault();
  $('.login-content').toggle();
  $('.signup-content').toggle();
});
