"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});


const mailer=async(email,subject,body)=> {
  const info = await transporter.sendMail({
    from: '"Blog MGMT 👻" <lakimdahal1@gmail.com>', 
    to: email, // list of receivers
    subject, 
    html: `<b>${body}</b>`, 
  });

  return info.messageId;
  
};

module.exports={mailer};