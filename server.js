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
    from: `"Travelly API" <${process.env.MAILER_USER}>`,
    to: process.env.SV_EMAIL,
    subject: "Travelly - Contact Us",
    text: `
    Name: ${req.body.name}
    Email: ${req.body.mail}
    Phone: ${req.body.telephone}
    Message: ${req.body.message}
    `
  };
  
  mailer.sendMail(mail)
  .then((info) => {
    console.log('Message sent: %s', info.messageId);
    return res.status(202).send({ message: 'Accepted', success: true });
  })
  .catch((err) => {
    console.log('ERROR:', err);
    return res.status(503).send({ message: 'Failed', success: false });
  });
})

app.listen(port, () => {
  console.log('Servidor en el puerto', port)
})