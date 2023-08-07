const express = require("express");
const app = express();
const port = 8080;
const nodemailer = require("nodemailer");
const validator = require("validator");
require("dotenv").config();

// MONGODB
const mongoose = require("mongoose");
const mongoDBPassword = process.env.MONGODB_PASSWORD;
const mongoDBUsername = process.env.MONGODB_USERNAME;
const mongoDBURL = `mongodb+srv://${mongoDBUsername}:${mongoDBPassword}@rodionscluster.ejhbsag.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(mongoDBURL).then(() => console.log("MongoDB connected"), error => console.log(error));

const timesSchema = new mongoose.Schema({
    date: Date,
    dateInLocaleString: String,
    taken: {
        type: Boolean,
        default: false
    }
});

const timesModel = new mongoose.model("timesModelName", timesSchema);

// NODEMAILER

const transporter = nodemailer.createTransport({
    host: "",
    port: 123,
    secure: true,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.use(express.static("build"));
app.use(express.json());

// GET all available dates
app.get("/api/dates", (req, res) => {
    console.log("GET request received /api/dates");
    const data = timesModel.find({ taken: false }).then((data) => {
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
            const dateDoc = await timesModel.findById(dateid);
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
    const emailText = `Новая запись на 15-ти минутную консультацию с сайта.\nДата (по МСК): ${date}\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone}`;

    // const emailTransporter = transporter.sendMail({
    //    from: "",
    //    to: "",
    //    subject: "Новая запись",
    //    text: emailText,
    // });
    function sanitizeString(dirtyString) {
        let cleanString = validator.blacklist(dirtyString, /<>\/\\\|`"'~/);
        cleanString = validator.escape(cleanString);
        cleanString = validator.trim(cleanString);
        cleanString = validator.stripLow(cleanString);
        return cleanString;
    }
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

        const newDateDocument = new timesModel({ date: dateGenerated, dateInLocaleString: dateInLocaleStringGenerated });
        newDateDocument.save();
    }
}

// updateAllDates();
async function updateAllDates() {
    const response = await timesModel.updateMany({ taken: true }, { taken: false });
    console.log(response.matchedCount);
    console.log(response.modifiedCount)
    console.log(response.acknowledged);
}