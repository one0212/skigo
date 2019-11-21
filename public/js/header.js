document.addEventListener('DOMContentLoaded', () => {
  // console.log('已載入完成2');
  fetch('/api/user/isLogin')
    .then((response) => {
      if (response.status === 200) {
        $('.user-bg-model').hide();
        $('.navbar-btn').hide();
        $('.login-show').show();
      } else {
        $('.navbar-btn').show();
      }
    });
});


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
// 驗證註冊 input是否為空字串
// 電子郵件RegExp
const emailRegex = new RegExp('^[\\w-\\.]+@[a-zA-Z]+\\.?.*[^\\.]$');
function signUpValueRequired(x) {
  if (x.value === '') {
    if (signupAccount.value === '') {
      signupAccount.setAttribute('style', 'border: 1px solid red');
      signupAccount.parentNode.nextElementSibling.setAttribute('style', 'display: block');
      signupAccount.parentNode.nextElementSibling.textContent = ' 電子郵件為必填 ';
    }
    if (signupPassword.value === '') {
      signupPassword.setAttribute('style', 'border: 1px solid red');
      signupPassword.parentNode.nextElementSibling.setAttribute('style', 'display: block');
      signupPassword.parentNode.nextElementSibling.textContent = ' 請輸入密碼 ';
    }
    return false;
  }
  if (!emailRegex.test(signupAccount.value)) {
    // x.setAttribute('style', 'border: 1px solid red');
    signupAccount.setAttribute('style', 'border: 1px solid red');
    signupAccount.parentNode.nextElementSibling.setAttribute('style', 'display: block');
    signupAccount.parentNode.nextElementSibling.textContent = ' 請輸入有效的電子郵件 ';
    return false;
  }
  return true;
}

signup.addEventListener('click', () => {
  const hasError = signupTextInput.map((x) => signUpValueRequired(x)).includes(false);
  if (hasError) {
    return;
  }
  const obj = {
    email: signupAccount.value,
    password: signupPassword.value,
    role: 'SKIGO', // TODO: 應判斷當入方式，設定對應的 role
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
      $('.navbar-btn').hide();
      $('.login-show').show();
    }
    // return response.json();
  }).catch((err) => {
    console.log(err);
  });
});


// 登入ajax
const login = document.querySelector('.login-btn');
const loginAccount = document.querySelector('#login-account');
const loginPassword = document.querySelector('#login-password');

// 驗證登入 input是否為空字串
function loginValueRequired(x) {
  if (x.value === '') {
    if (loginAccount.value === '') {
      loginAccount.setAttribute('style', 'border: 1px solid red');
      loginAccount.parentNode.nextElementSibling.setAttribute('style', 'display: block');
      loginAccount.parentNode.nextElementSibling.textContent = ' 電子郵件為必填 ';
    }
    if (loginPassword.value === '') {
      loginPassword.setAttribute('style', 'border: 1px solid red');
      loginPassword.parentNode.nextElementSibling.setAttribute('style', 'display: block');
      loginPassword.parentNode.nextElementSibling.textContent = ' 請輸入密碼 ';
    }
    return false;
  }
  if (!emailRegex.test(loginAccount.value)) {
    // x.setAttribute('style', 'border: 1px solid red');
    signupAccount.setAttribute('style', 'border: 1px solid red');
    signupAccount.parentNode.nextElementSibling.setAttribute('style', 'display: block');
    signupAccount.parentNode.nextElementSibling.textContent = ' 請輸入註冊所使用的電子郵件 ';
    return false;
  }
  return true;
}

login.addEventListener('click', () => {
  const hasError = loginTextInput.map((x) => loginValueRequired(x)).includes(false);
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
      $('.user-bg-model').hide();
      $('.navbar-btn').hide();
      $('.login-show').show();
    }
    // console.log(response.json())
    return response.json();
  });
});
function initBorder() {
  this.setAttribute('style', 'border: 1px solid #6A6A6A');
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


// 購物車點擊觸發登入  登入的話跳轉到購物車頁面
$('.navbar-shopping').click(() => {
  fetch('/api/user/isLogin')
    .then((response) => {
      // 如果沒有登入就跳出登入畫面
      if (response.status !== 200) {
        $('.user-bg-model').css('display', 'flex');
      } else {
        window.location.href = 'http://localhost:3000/shopping_cart.html';
      }
    });
});


// 關閉光箱
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
  const forget = document.querySelector('#forget-pwd-input');
  if (forget.value === '') {
    forget.setAttribute('style', 'border: 1px solid red');
    forget.parentNode.nextElementSibling.setAttribute('style', 'display: block');
    forget.parentNode.nextElementSibling.textContent = ' 電子郵件為必填 ';
    return false;
  }
  if (!emailRegex.test(forget.value)) {
    forget.setAttribute('style', 'border: 1px solid red');
    forget.parentNode.nextElementSibling.setAttribute('style', 'display: block');
    forget.parentNode.nextElementSibling.textContent = ' 請輸入註冊所使用的電子郵件 ';
  }
  return true;
});


// 回登入頁
$('.user-back-login').click((e) => {
  e.preventDefault();
  $('.forget-content').toggle();
  $('.login-content').toggle();
});

// 頭像點擊下拉選單
$('.navbar-user').click(() => {
  $('.user-drop-list').toggleClass('active');
});
