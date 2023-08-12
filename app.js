const express = require("express");
const app = express();
const port = 8080;
require("dotenv").config();
const { mongoose, dateModel } = require("./database");
const { transporter } = require("./email");
const { sanitizeString } = require("./sanitizeString");

app.use(express.static("build"));
app.use(express.json());

// GET all available dates
app.get("/api/dates", (req, res) => {
    console.log("GET request received /api/dates");
    const data = dateModel.find({ taken: false }).then((data) => {
        data[0];
        return res.json(data);
    });
});

// PUT date as taken
app.put("/api/dates/:dateid", (req, res) => {
    console.log("PUT api/dates/:dateid request received");
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
    console.log("POST booking email for /api/email/booking received");
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
        from: "hi@dariazherebtsova.ru",
        to: "rodionvh@gmail.com",
        subject: "Новая запись с сайта",
        html: emailBody
    }

    transporter.sendMail(message, (err, info) => {
        if (err) 
            console.log(err);
        else 
            console.log(info.response)
    });
});

app.listen(port, () => console.log("Listening to port " + port));

// generateNewDates();
function generateNewDates() {
    for (let i = 0; i < 15; i++) {
        const dateGenerated = `2023-08-${i+10}T11:00`

        const options = {
            dateStyle: "short",
            timeStyle: "short",
            timeZone: "UTC"
        }
        
        const dateInLocaleStringGenerated = new Date(dateGenerated).toLocaleString("ru-RU", options);

        const newDateDocument = new dateModel({ date: dateGenerated, dateInLocaleString: dateInLocaleStringGenerated });
        newDateDocument.save();
    }
}

// updateAllDates();
async function updateAllDates() {
    const response = await dateModel.updateMany({ taken: true }, { taken: false });
    console.log(response.matchedCount);
    console.log(response.modifiedCount)
    console.log(response.acknowledged);
}