// server/utils/mailSender.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // 내 메일 주소
    pass: process.env.EMAIL_PASS, // 앱 비밀번호
  },
});

const sendResetMail = async (toEmail, tempPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: '[GwangMa Mail] 임시 비밀번호 안내입니다.',
    html: `
      <h1>비밀번호 초기화 안내</h1>
      <p>요청하신 임시 비밀번호는 다음과 같습니다.</p>
      <h2 style="color: blue;">${tempPassword}</h2>
      <p>로그인 후 반드시 비밀번호를 변경해 주세요.</p>
    `,
  };
  return transporter.sendMail(mailOptions);
};

module.exports = sendResetMail;