const nodemailer = require("nodemailer");

const sendEmail = async (mailOptions) => {
  let transpoter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  let info = await transpoter.sendMail(mailOptions);
  console.log(`Message Send : ${info.messageId}`);
};

module.exports = sendEmail;
