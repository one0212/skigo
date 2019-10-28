window.onload = () => {
  signupBtn.onclick = () => {
    let email = signupEmail.value;
    let password = signupPwd.value;
    if (!verifyBeforeSignup(email, password)) {
      return;
    }

    console.log(`Sign-up for email:${email} password:${password}`);
    doSignup(email, password);
  };

  loginBtn.onclick = () => {
    let email = loginEmail.value;
    let password = loginPwd.value;
    if (!verifyBeforeLogin(email, password)) {
      return;
    }

    console.log(`Login for email:${email} password:${password}`);
    doLogin(email, password);
  };

  function verifyBeforeSignup(email, password) {
    return email && password;
  }

  function doSignup(email, password) {
    console.log(JSON.stringify({ email: email, password: password }));
    fetch('/api/user/signup', {
      method: 'post',
      body: JSON.stringify({ email: email, password: password }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json);
        response.innerText = JSON.stringify(json);
      });
  }

  function verifyBeforeLogin(email, password) {
    return email && password;
  }

  function doLogin(email, password) {
    console.log(JSON.stringify({ email: email, password: password }));
    fetch('/api/user/login', {
      method: 'post',
      body: JSON.stringify({ email: email, password: password }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log(json);
        response.innerText = JSON.stringify(json);
      });
  }
};
