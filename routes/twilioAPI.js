const config = require("../config"),
  client = require("twilio")(config.app.SID, config.app.TOKEN),
  cleaner_Schema = require("../models/cleanerModel"),
  errorHandler = require('../controller/errorHandler');

module.exports = (app) => {
  app.get("/api/sendmessage/:type/:entranceName", async (req, res) => {
    try {
      let phoneNumbers = [];
      if (req.params.type == "SecurityTeam") {
        phoneNumbers = await cleaner_Schema.find({ role: "Security Team" }, { phoneNumber: 1 }).lean();
      } else if (req.params.type == "CleaningTeam") {
        phoneNumbers = await cleaner_Schema.find({ role: "Cleaning Team" }, { phoneNumber: 1 }).lean();
      }
      else
        return res.status(406).send({ message: "Not a valid role" });

      Promise.all(
        phoneNumbers.map((ele) => {
          return client.messages.create({
            to: ele.phoneNumber,
            from: "+14387002462",
            body: `Potential case suspected at ${req.params.entranceName}`,
          });
        })
      )
        .then((messages) => {
          console.log("Messages sent!");
          res.status(200).send("Messages sent");
        })
        .catch((err) => {
          console.error(err);
          return res.status(406).send({ message: err.message });
        });
    } catch (err) {
      res.status(406).send(err);
    }
  });
};
