const nodemailer = require('nodemailer');

import * as dotenv from 'dotenv';

dotenv.config();

const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

const pass = process.env.EMAIL_PASSWORD;

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendEmailMessage = async (email, message) => {
  let mails = {
    form: ` Gozle <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'Gözle Wideo registrasiýa',
    html: message,
  };

  await transporter.sendMail(mails, (err, data) => {
    if (err) {
      myCache.take(`${email}`, true);
      console.log(err);
      return false;
    } else {
      console.log('gitdi');
      return true;
    }
  });
};
