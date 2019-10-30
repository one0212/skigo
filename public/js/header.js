// 登入驗證
const signupTextInput = [...document.querySelectorAll('.signup-input')];
const loginTextInput = [...document.querySelectorAll('.login-input')];
// const submitBtn = document.querySelectorAll(".submit");
// const signupTextInput = [...signupInputs]
const allTextInputs = [...document.querySelectorAll('.user-text-input')];

// 註冊ajax
const signup = document.querySelector('.signup-btn');
const signupAccount = document.querySelector('#signup-account');
const signupPassword = document.querySelector('#signup-password');
// 驗證input是否為空字串
function valueRequired(x) {
  if (x.value === '') {
    console.log(x);
    x.setAttribute('style', 'border: 1px solid red');
    x.parentNode.nextElementSibling.setAttribute('style', 'display: block');
    return false;
  }
  return true;
}
signup.addEventListener('click', () => {
  const hasError = signupTextInput.map((x) => valueRequired(x)).includes(false);
  if (hasError) {
    return;
  }
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
  const hasError = loginTextInput.map((x) => valueRequired(x)).includes(false);
  if (hasError) {
    return;
  }
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
function initBorder() {
  this.setAttribute('style', 'border: 1px solid #ccc');
  this.parentNode.nextElementSibling.setAttribute('style', 'display:none');
}
// 驗證
allTextInputs.forEach((input) => {
  // console.log('change')
  input.addEventListener('keypress', initBorder);
});
// 光箱開關
document.querySelector('.navbar-btn').addEventListener('click', () => {
  document.querySelector('.user-bg-model').style.display = 'flex';
});
const closeModels = document.querySelectorAll('.close-model');
const models = [...closeModels];
models.forEach((x) => {
  x.addEventListener('click', () => {
    $('.user-bg-model').css('display', 'none');
  });
});
// 註冊登入切換
$('.toggle-login').click((e) => {
  e.preventDefault();
  $('.login-content').toggle();
  $('.signup-content').toggle();
});

// 忘記密碼
$('.forget-pwd').click((e) => {
  e.preventDefault();
  $('.login-content').toggle();
  $('.forget-content').toggle();
});
// 忘記密碼input驗證
$('.resend-pwd').click(() => {
  // 將jquery對象轉換成dom對象
  const x = $('#forget-pwd-input').get(0);
  valueRequired(x);
});
// 回登入頁
$('.user-back-login').click((e) => {
  e.preventDefault();
  $('.forget-content').toggle();
  $('.login-content').toggle();
});
