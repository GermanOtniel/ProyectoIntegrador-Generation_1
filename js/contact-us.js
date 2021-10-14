function register(){
  //Declarando variables
  var formulario_login = document.querySelector(".formulario__login");
  var formulario_register = document.querySelector(".formulario__register");
  var contenedor_login_register = document.querySelector(".contenedor__login-register");
  var caja_trasera_login = document.querySelector(".caja__trasera-login");
  //var caja_trasera_register = document.querySelector(".caja__trasera-register");
  if (window.innerWidth > 850){
      formulario_register.style.display = "block";
      contenedor_login_register.style.left = "410px";
      formulario_login.style.display = "none";
      //caja_trasera_register.style.opacity = "0";
      caja_trasera_login.style.opacity = "1";
  }else{
      formulario_register.style.display = "block";
      contenedor_login_register.style.left = "0px";
      formulario_login.style.display = "none";
      //caja_trasera_register.style.display = "none";
      caja_trasera_login.style.display = "block";
      caja_trasera_login.style.opacity = "1";
  }
}

register();

function validation() {
  let name = document.getElementById("contact-us-name");
  let mail = document.getElementById("contact-us-mail");
  let telephone = document.getElementById("contact-us-telephone");
  let message = document.getElementById("contact-us-message");

  name.value = name.value.trim();
  mail.value = mail.value.trim();
  telephone.value = telephone.value.trim();
  message.value = message.value.trim();

  let notError = true;

  if(validateName(name.value)===false){
      name.classList.add("is-invalid");
      notError=false;
  }else{
      name.classList.remove("is-invalid");
  }

  if(validateEmail(mail.value)===false){
      mail.classList.add("is-invalid");
      notError=false;
  }else{
      mail.classList.remove("is-invalid");
  }

  if(validateTelephone(telephone.value)===false){
      telephone.classList.add("is-invalid");
      notError=false;
  }else{
      telephone.classList.remove("is-invalid");
  }

  if(validateMessage(message.value)===false){
      message.classList.add("is-invalid");
      notError=false;
  }else{
      message.classList.remove("is-invalid");
  }
  if (notError) {
    return {
        name: name.value,
        mail: mail.value,
        telephone: telephone.value,
        message: message.value
    }
  } else {
    return null;
  }
}

function enableSendMailButton(btn) {
  btn.innerHTML = "Enviar";
  btn.disabled = false;
}

function disableSendMailButton(btn) {
  btn.innerHTML = `<div class="d-flex justify-content-center"><div class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div><span></span></div>`;
  btn.disabled = true;
}

function sendData(event) {
  const msgOK = document.getElementById('toast-ok');
  const msgError = document.getElementById('toast-error');
  let msgToShow = null;
  
  let data = validation();

  console.log(data);

  if(data !== null) {

    disableSendMailButton(event.target);

    fetch("http://127.0.0.1:3000/contact-us", {
        method: "POST",
        headers: {
            "Content-Type" : 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      msgToShow = data.success ? msgOK : msgError;
    })
    .catch((err) => {
      console.log(err);
      msgToShow = msgError;
    })
    .finally(() => {
      const toast = new bootstrap.Toast(msgToShow);
      toast.show();
      enableSendMailButton(event.target);
      // reset form
      document.querySelector('form').reset();
    });
  }
}

document.getElementById("sub-btn").addEventListener("click", sendData);
