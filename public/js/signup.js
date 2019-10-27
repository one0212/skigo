// 登入驗證
var account = document.querySelector("#account");
var password = document.querySelector("#password")
var AllInputs = document.querySelectorAll(".text-input")
var submitBtn = document.querySelector("#submit");
var inputs = [...AllInputs]
// console.log(inputs)

submitBtn.addEventListener('click', function() {
    // e.preventDefault();
    inputs.map(x => { 
        if(x.value == ''){
            console.log(x)
            x.style.border = "1px solid red";
            // x.style.background = "seashell";
            // console.log(x.nextElementSibling)
            x.parentNode.nextElementSibling.style.display = 'block';
        }
    })
    const obj = {
            email: account.value,
            password: password.value
        };
    fetch('/api/user/signup', {
        body: JSON.stringify(obj),
        headers: {
            'content-type' : 'application/json',
        },
        method: 'POST'
    })
    .then(response=>{
        // console.log(response)
        if(response.status === 200){
            console.log('註冊成功！')
        }
        return response.json()
        
    })
    .then(obj=>{
        console.log(obj)
        
    })
})
inputs.map(input=> {
    // console.log('change')
    input.addEventListener('keypress',function() {
    // console.log('change')
        this.style.background = "#fff";
        this.style.border = "1px solid #ccc";
        this.parentNode.nextElementSibling.style.display = 'none';
    })    
})
// 光箱開關
document.querySelector(".login-btn").addEventListener('click', ()=> {
    document.querySelector(".bg-model").style.display = 'flex';
});
document.querySelector(".close-model").addEventListener('click', ()=> {
    document.querySelector(".bg-model").style.display = 'none';
});
