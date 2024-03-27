const nodemailer = require('nodemailer');
import * as conf from '../config/config.json';
import * as dotenv from 'dotenv';

dotenv.config();

const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

let transporter = nodemailer.createTransport({
  host: process.env.EmailHost,
  port: process.env.EmailPort,
  secure: false,
  from: 'gozle.org',
  auth: {
    user: process.env.EmailuserName,
    pass: process.env.EmailpassKey,
  },
});

exports.sendEmailMessage = async (email, message) => {
  let mails = {
    from: 'gozle.org',
    to: email,
    subject: 'Gözle Wideo registrasiýa',
    html: message,
  };

  await transporter.sendMail(mails, (err, data) => {
    if (err) {
      myCache.take(`${email}`, true);
      return false;
    } else {
      return true;
    }
  });
};
