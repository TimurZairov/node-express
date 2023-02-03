const keys = require('../keys')
const nodemailer = require("./nodemailer");

module.exports = async function resetPass(email) {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: keys.MAIL_USERNAME,
            pass: keys.MAIL_PASSWORD,
            clientId: keys.CLIENT_ID,
            clientSecret: keys.CLIENT_SECRET,
            refreshToken: keys.REFRESH_TOKEN,
        }
    });

    let info = await transporter.sendMail({
        from: 'zairovne@gmail.com', // sender address
        to: email, // list of receivers
        subject: "На это письмо не надо отвечать", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
}
