import * as dotenv from 'dotenv';

var nodemailer = require('nodemailer');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

exports.sendEmailMessage = async (email, message) => {
  let mails = {
    form: ` Gozle <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'Gözle Wideo registrasiýa',
    html: message,
  };

  transporter.sendMail(
    {
      from: `Gozle Video <video@gozle.org>`,
      subject: 'Test',
      to: 'rowshan_97@mail.ru',
      text: 'Test',
    },
    (error, info) => {
      if (error) {
        myCache.take(`${email}`, true);
        console.log('Error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    },
  );
};
