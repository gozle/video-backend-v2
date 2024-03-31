import * as dotenv from 'dotenv';

var nodemailer = require('nodemailer');
dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

const host = process.env.EMAIL_HOST;
const port = parseInt(process.env.EMAIL_PORT);
const user = process.env.EMAIL_USERNAME;
const pass = process.env.EMAIL_PASSWORD;

let transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: false,
  auth: {
    user: user,
    pass: pass,
  },
});

const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

exports.sendEmailMessage = async (email, message) => {
  let mails = {
    form: ` Gozle <${user}>`,
    to: email,
    subject: 'Gözle Wideo registrasiýa',
    html: message,
  };

  transporter.sendMail(mails, (error, info) => {
    if (error) {
      myCache.take(`${email}`, true);
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
