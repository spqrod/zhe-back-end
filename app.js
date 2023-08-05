const express = require("express");
const app = express();
const port = 8080;

const mongoose = require("mongoose");
const mongoDBURL = "mongodb+srv://rodionsmongodb:qVebdKFuuQotiSK3@rodionscluster.ejhbsag.mongodb.net/?retryWrites=true&w=majority";

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



app.use(express.static("build"));

// GET all available dates
app.get("/api/dates", (req, res) => {
    console.log("GET request received /api/dates");
    const data = timesModel.find({ taken: false }).then((data) => {
        data[0];
        return res.json(data);
    });
});

// PUT. Update a date as taken
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

// Post new date
app.post("api/dates/", (req, res) => {
    console.log("POST request for /api/dates/ received");
    console.log(req);
});



// Delete

app.listen(port, () => console.log("listening to port " + port));

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