import htmlBody from './emailBody';
const nodemailer = require('nodemailer');

let transporer = nodemailer.createTransport({
   host: process.env.EMAIL_SERVER_HOST,
   port: process.env.EMAIL_SERVER_PORT,
   secure: false, // true for 465, false for other ports
   auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
   },
});

const sendRecoveryMail = async (email: string | string[], text: string, link: string) => {
   const { host } = new URL(link);
   let info = await transporer
      .sendMail({
         from: process.env.EMAIL_FROM,
         to: email,
         subject: 'Password Recovery',
         text: text,
         html: htmlBody(link, host),
      })
      .catch((err: any) => console.log(err));

   //   return { info.messageId }
};

export default sendRecoveryMail;

// smtp connections established but have to disconnect it?
// do a callback with error and connection.end()?

// messange configuration:
// advanced tools: "references" that can be useful? *??*
//
