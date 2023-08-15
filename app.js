const express = require("express");
const app = express();
const port = 80;
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const { mongoose, dateModel } = require("./database");
const { transporter } = require("./email");
const { sanitizeString } = require("./sanitizeString");
const { logger } = require("./logger");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    // Log an info message for each incoming request
    logger.info(`Received a ${req.method} request for ${req.url}`);
    next();
});

// GET all available dates
app.get("/api/dates", (req, res) => {
    const data = dateModel.find({ taken: false }).then((data) => {
        data[0];
        return res.json(data);
    });
});

// PUT date as taken
app.put("/api/dates/:dateid", (req, res) => {
    const { dateid } = req.params;
    findByIdAndUpdate();
    let resultStatus;

    async function findByIdAndUpdate() {
        try {
            const dateDoc = await dateModel.findById(dateid);
            // dateDoc.taken = true;
            // dateDoc.save();
            resultStatus = true;
        }
        catch {
            console.log("Date update to taken unsuccessful");
            resultStatus = false;
        }
        return res.json({ isSuccessfullyUpdated: resultStatus });
    }
});

// POST booking email
app.post("/api/email/booking", (req, res) => {
    let { date, name, email, phone } = req.body;
    date = sanitizeString(date);
    name = sanitizeString(name);
    email = sanitizeString(email);
    phone = sanitizeString(phone);

    const emailBody = `<h2>Новая запись на 15-ти минутную консультацию с сайта.</h2>
    <p>Дата (по МСК): ${date}</p>
    <p>Имя: ${name}</p>
    <p>Email: ${email}</p>
    <p>Телефон: ${phone}</p>`;

    const message = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: "Новая запись с сайта",
        html: emailBody
    };

    transporter.sendMail(message, (err, info) => {
        if (err) 
            console.log(err);
        else 
            console.log(info.response)
    });
});

// POST contact email
app.post("/api/contact", async (req, res) => {

    // const { token, inputVal } = req.body;
    // const googleURL = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${token}`;


    // try {
    //     const response = await axios.post("")
    
    //     if (response.data.success) {
    //         res.send("reCAPTCHA successful");
    //     } else 
    //         res.send("reCAPTCHA failed");
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send("Error verifying reCAPTCHA");
    // }

    let { name, email, phone, formMessage } = req.body;
    name = sanitizeString(name);
    email = sanitizeString(email);
    phone = sanitizeString(phone);
    formMessage = sanitizeString(formMessage);
    
    const emailBody = `<h2>Новое сообщение с сайта</h2>
    <p>Имя: ${name}</p>
    <p>Email: ${email}</p>
    <p>Телефон: ${phone}</p>
    <p>Сообщение: ${formMessage}</p>`;

    const message = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: "Новое сообщение с сайта",
        html: emailBody
    };

    transporter.sendMail(message)
        .then(() => res.json({success: true}))
        .catch(() => res.json({success: false}));
});

app.get("/test", (req, res) => {
    res.json({ status: "received" });
})

app.listen(port, () => console.log("Listening to port " + port));