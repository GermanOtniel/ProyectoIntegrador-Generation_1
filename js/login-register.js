//Ejecutando funciones
document.getElementById("btn__iniciar-sesion").addEventListener("click", iniciarSesion);
document.getElementById("btn__registrarse").addEventListener("click", register);
window.addEventListener("resize", anchoPage);

//Declarando variables
var formulario_login = document.querySelector(".formulario__login");
var formulario_register = document.querySelector(".formulario__register");
var contenedor_login_register = document.querySelector(".contenedor__login-register");
var caja_trasera_login = document.querySelector(".caja__trasera-login");
var caja_trasera_register = document.querySelector(".caja__trasera-register");

    //FUNCIONES

function anchoPage(){

    if (window.innerWidth > 850){
        caja_trasera_register.style.display = "block";
        caja_trasera_login.style.display = "block";
    }else{
        caja_trasera_register.style.display = "block";
        caja_trasera_register.style.opacity = "1";
        caja_trasera_login.style.display = "none";
        formulario_login.style.display = "block";
        contenedor_login_register.style.left = "0px";
        formulario_register.style.display = "none";   
    }
}

anchoPage();


    function iniciarSesion(){
        if (window.innerWidth > 850){
            formulario_login.style.display = "block";
            contenedor_login_register.style.left = "10px";
            formulario_register.style.display = "none";
            caja_trasera_register.style.opacity = "1";
            caja_trasera_login.style.opacity = "0";
        }else{
            formulario_login.style.display = "block";
            contenedor_login_register.style.left = "0px";
            formulario_register.style.display = "none";
            caja_trasera_register.style.display = "block";
            caja_trasera_login.style.display = "none";
        }
    }

    function register(){
        if (window.innerWidth > 850){
            formulario_register.style.display = "block";
            contenedor_login_register.style.left = "410px";
            formulario_login.style.display = "none";
            caja_trasera_register.style.opacity = "0";
            caja_trasera_login.style.opacity = "1";
        }else{
            formulario_register.style.display = "block";
            contenedor_login_register.style.left = "0px";
            formulario_login.style.display = "none";
            caja_trasera_register.style.display = "none";
            caja_trasera_login.style.display = "block";
            caja_trasera_login.style.opacity = "1";
        }
}

const buttonRegisterAction = document.getElementById('action-register');
const fullNameInput = document.getElementById('fullname-reg');
const emailInput = document.getElementById('email-reg');
const passwordInput = document.getElementById('pass-reg');
const passwordConfirmInput = document.getElementById('pass-confirm-reg');
const selectLoginBtn = document.getElementById('btn__iniciar-sesion');
const selectRegisterBtn = document.getElementById('btn__registrarse');
const errFName = document.getElementById('error-fullname');
const errEmail = document.getElementById('error-email');
const errPass = document.getElementById('error-pass');
const phoneNumber = document.getElementById('phone-reg');
const errPhone = document.getElementById('error-number');

const emailLogin = document.getElementById('login-email');
const passwordLogin = document.getElementById('login-pass');
const actionBtnLogin = document.getElementById('action-login');
const textErrorEmailLogin = document.getElementById('error-email-login');
const textErrorPassLogin = document.getElementById('error-pass-login');

const resetFormValues = () => {
    [fullNameInput, emailInput, passwordInput, passwordConfirmInput, emailLogin, passwordLogin].forEach((input) => {
        input.value = '';
        input.classList.remove('is-invalid');
    });

    [errFName, errEmail, errPass, textErrorEmailLogin, textErrorPassLogin].forEach((errorText) => {
        errorText.innerText = '';
    });
};

selectLoginBtn.addEventListener('click', function (e) {
    resetFormValues();
});

selectRegisterBtn.addEventListener('click', function (e) {
    resetFormValues();
});

const renderErrorMsg = () => {
    const msgError = document.getElementById('index-action-error');
    const toast = new bootstrap.Toast(msgError);
    toast.show();
};

function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateName(name) {
    var regex = /^[a-zñáéíóúü ]{2,50}$/i;
    return regex.test(name);
}

function validatePasswords(pass1, pass2) {
    const re = /(?=.{8,})/;
    return re.test(pass1) && re.test(pass2) && (pass1 === pass2);
}
function validatePhoneNumber(phone) {
    const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if(phone.match(re)) {
      return true;
    }
    
    return false;
    
  }

function validatePassword(pass) {
    return pass.trim() !== '';
}

const validateDataRegister = () => {
    let existError = false;

    if (!validateEmail(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        errEmail.innerText = 'El correo electrónico es inválido';
        existError = true;
    } else {
        emailInput.classList.remove('is-invalid');
        errEmail.innerText = '';
    }
    if (!validateName(fullNameInput.value)) {
        fullNameInput.classList.add('is-invalid');
        errFName.innerText = 'El nombre es inválido';
        existError = true;
    } else {
        fullNameInput.classList.remove('is-invalid');
        errFName.innerText = '';
    }
    if (!validatePasswords(passwordInput.value, passwordConfirmInput.value)) {
        passwordInput.classList.add('is-invalid');
        passwordConfirmInput.classList.add('is-invalid');
        errPass.innerText = 'Las contraseñas no coinciden o son menores a 8 caracteres';
        existError = true;
    } else {
        passwordInput.classList.remove('is-invalid');
        passwordConfirmInput.classList.remove('is-invalid');
        errPass.innerText = '';
    }
    if(!validatePhoneNumber(phoneNumber.value)){
        phoneNumber.classList.add('is-invalid');
        errPhone.innerText = 'El número de teléfono es inválido';
        existError = true;
    }else{
        phoneNumber.classList.remove('is-invalid');
        errPhone.innerText = '';
        existError = false;
    }
    return existError;
};

buttonRegisterAction.addEventListener('click', function(e) {
    e.preventDefault();
    const existsErrors = validateDataRegister();
    if (!existsErrors) {
        const newUser = {
            "full_name": fullNameInput.value,
            "phone_number" : phoneNumber.value,
            "email": emailInput.value,
            "password": passwordConfirmInput.value
        };
        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        .then((res) => res.json())
        .then((data) =>  {
            localStorage.setItem(
                'userSession',
                JSON.stringify(newUser)
            );
            window.location.href = '/home.html';
        })
        .catch((err) => {
            renderErrorMsg();
        })
    }
});

const validateDataLogin = () => {
    let existError = false;
    if (!validateEmail(emailLogin.value)) {
        existError = true;
        emailLogin.classList.add('is-invalid');
        textErrorEmailLogin.innerText = 'El correo electróncio es inválido';
    } else {
        existError = false;
        emailLogin.classList.remove('is-invalid');
        textErrorEmailLogin.innerText = '';
    }
    if (!validatePassword(passwordLogin.value)) {
        existError = true;
        passwordLogin.classList.add('is-invalid');
        textErrorPassLogin.innerText = 'La contraseña es un campo requerido';
    } else {
        existError = false;
        passwordLogin.classList.remove('is-invalid');
        textErrorPassLogin.innerText = '';
    }

    return existError;
};

const checkCorrectPassword = (passwordUser, passwordSaved) => {
    return passwordUser === passwordSaved;
};

actionBtnLogin.addEventListener('click', function(e) {
    e.preventDefault();
    const existsErrors = validateDataLogin();
    if (!existsErrors) {
        fetch(`http://localhost:8080/login`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                email: emailLogin.value,
                password: passwordLogin.value
            })
        })
        .then((res) => res.json())
        .then((data) =>  {
            console.log(data);
            if (data != null){
                localStorage.setItem(
                    'userSession',
                    JSON.stringify(data)
                );
                window.location.href = '/home.html';

            }
            else {
                emailLogin.classList.add('is-invalid');
                textErrorEmailLogin.innerText = 'Las credenciales son inválidas';
                passwordLogin.classList.add('is-invalid');
                textErrorPassLogin.innerText = 'Las credenciales son inválidas';
            }
        })
        .catch((err) => {
            renderErrorMsg();
        })
    }
});