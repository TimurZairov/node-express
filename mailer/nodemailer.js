const nodemailer = require('nodemailer')
const keys = require('../keys')

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
    // ОТправка на почту по регистрации
    async function main(email) {

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'zairovne@gmail.com', // sender address
        to: email, // list of receivers
        subject: "На это письмо не надо отвечать", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    // console.log(info)
    // console.log("Message sent: %s", info.messageId);
}
    // Восстановление пароля
    async function resetPass(email, token) {

    let info = await transporter.sendMail({
        from: 'zairovne@gmail.com', // sender address
        to: email, // list of receivers
        subject: "Восстановление пароля", // Subject line
        text: "Если вы не понимаете что это за письмо, просто проигнорируйте его", // plain text body
        html: `<b><a href="${keys.BASE_URL}/auth/password/${token}">Перейдите по ссылке для восстановления</a> </b>`, // html body
    });
}

module.exports = {
    main,
    resetPass
}
