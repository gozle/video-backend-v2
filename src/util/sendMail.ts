const nodemailer = require('nodemailer');
import * as conf from '../config.json';

let transporter = nodemailer.createTransport({
  host: conf.EmailHost,
  port: conf.EmailPort,
  secure: false,
  auth: {
    user: conf.EmailuserName,
    pass: conf.EmailpassKey,
  },
});

exports.sendEmailMessage = (email, message) => {
  let mails = {
    from: 'Gozle',
    to: email,
    subject: 'Gözle Wideo registrasiýa',
    // text: 'Your confirmation code is:' + code,
    html: message,
  };

  transporter.sendMail(mails, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Success');
    }
  });
};
