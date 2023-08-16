const mongoose = require("mongoose");
const mongoDBPassword = process.env.MONGODB_PASSWORD;
const mongoDBUsername = process.env.MONGODB_USERNAME;
const mongoDBURL = `mongodb+srv://${mongoDBUsername}:${mongoDBPassword}@rodionscluster.ejhbsag.mongodb.net/?retryWrites=true&w=majority`;
const { logger } = require("./logger");

mongoose.connect(mongoDBURL).then(() => logger.info("Connected to MongoDB"), error => logger.info(error));

const timesSchema = new mongoose.Schema({
    date: Date,
    dateInLocaleString: String,
    taken: {
        type: Boolean,
        default: false
    }
});

const dateModel = new mongoose.model("timesModelName", timesSchema);

exports.mongoose = mongoose;
exports.dateModel = dateModel;