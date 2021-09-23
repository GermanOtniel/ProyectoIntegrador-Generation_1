function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateName(name) {
  var regex = /^[a-zA-Z ]{2,30}$/;
  return regex.test(name);
}

function validateTelephone(number) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneno.test(number);
}

function validateMessage(message) {
  return message.length !== 0;
}
function validation() {
  let name = document.getElementById("contact-us-name");
  let mail = document.getElementById("contact-us-mail");
  let telephone = document.getElementById("contact-us-telephone");
  let message = document.getElementById("contact-us-message");
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
function sendData() {
  let data = validation();
  console.log(data);
  if(data!== null){
      console.log(data);
      fetch("http://127.0.0.1:3000/contact-us", {
          method: "POST",
          headers: {
              "Content-Type" : 'application/json'
          },
          body: JSON.stringify(data)
      }).then((res)=> console.log(res))
      .catch((error)=>console.log(error))
  }
}

document.getElementById("sub-btn").addEventListener("click", sendData);
