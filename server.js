require('dotenv').config();

const express = require('express');
const mailer = require('./mailer');

const app = express();

const port = process.env.SV_PORT || 3000;

app.use(express.json());

let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);

app.post('/contact-us', (req, res) => {
  let mail = {
    to: process.env.SV_EMAIL,
    subject: "Travelly - Contact Us",
    text: `${req.body.message}`
  };
  mailer.sendMail(mail);
  return res.status(200).send({ msg: 'ok' });
})

app.listen(port, () => {
  console.log('Servidor en el puerto', port)
})