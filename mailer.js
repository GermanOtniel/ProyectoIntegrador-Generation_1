const nodemailer = require('nodemailer');

/**
 * @class Mailer
 * Sends messages to emails
 */
class Mailer {
  /**
   * @constructor
   * Configures the mailer transporter
   */
  constructor() {
    this.configHotmail();
    this.transporter.verify((err, success) => {
      if (err) {
        console.log(err);
      } else {
        console.log('SMTP Connect!', success);
      }
    });

    this.mailOptions = {
      from: `"Testing mailer" <${process.env.MAILER_USER}>`,
      to: '"John Doe" john.doe@email.com',
      subject: 'Hello ✔',
      text: 'Hello Testing?',
      html: '<b>Hello Testing?</b>',
    };
  }

  /**
   * @method configEthereal
   * Configures the transport with ethereal
   */
  configEthereal() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
      },
    });
  }

  configHotmail() {
    this.transporter = nodemailer.createTransport({
      service: "Hotmail",
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
      },
    });
  }

  /**
   * @method sendMail - Sends message to email
   *
   * @param  {Object} options - the mail options
   * ----------
   * Example:
   *   options = {
   *     from: '"Testing mailer" <testing@mailer.com>',
   *     subject: 'Hello ✔',
   *     text: 'Hello Testing?',
   *     html: '<b>Hello Testing?</b>',
   *     };
   */
  sendMail(options) {
    this.transporter.sendMail({ ...this.mailOptions, ...options }, (err, info) => {
      if (err) {
        console.log(err);
      } else if (info) {
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    });
  }
}

module.exports = new Mailer();