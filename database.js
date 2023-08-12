const mongoose = require("mongoose");
const mongoDBPassword = process.env.MONGODB_PASSWORD;
const mongoDBUsername = process.env.MONGODB_USERNAME;
const mongoDBURL = `mongodb+srv://${mongoDBUsername}:${mongoDBPassword}@rodionscluster.ejhbsag.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(mongoDBURL).then(() => console.log("Connected to MongoDB"), error => console.log(error));

const dateSchema = new mongoose.Schema({
    date: Date,
    dateInLocaleString: String,
    taken: {
        type: Boolean,
        default: false
    }
});

const dateModel = new mongoose.model("timesModelName", dateSchema);

exports.mongoose = mongoose;
exports.dateModel = dateModel;