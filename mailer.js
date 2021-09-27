const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.log(err);
  } else {
    console.log('SMTP Connect!', success);
  }
});

module.exports = transporter;