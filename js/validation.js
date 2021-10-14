function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  return re.test(String(email));
}

function validateName(name) {
  var regex = /^[a-zñáéíóúü ]{2,30}$/i;
  return regex.test(name);
}

function validateTelephone(number) {
  var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneno.test(number);
}

function validateMessage(message) {
  return message.length !== 0;
}
