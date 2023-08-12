const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.dariazherebtsova.ru",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

transporter.verify(function (error, success) {
    if (error)
        console.log(error);
    else    
        console.log("Connected to mail server");
});

exports.transporter = transporter;