const nodemailer = require("nodemailer");

async function sendMail( message ) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure:true, // true for 465, false for other ports 587
        requireTLS: true,
        auth: {
            user: "kevinduglas83@yandex.ru",
            pass: "12345xyz"
        }
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'kevinduglas83@yandex.ru', // sender address
        to: "d.mon110kg@gmail.com", // list of receivers
        subject: "very important", // Subject line
        text: message, // plain text body
        html: "<b>"+message+"</b>", // html body
    });

}

module.exports = sendMail;
