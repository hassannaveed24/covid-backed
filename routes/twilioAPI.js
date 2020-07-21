const config = require("../config");
const client = require("twilio")(config.app.SID, config.app.TOKEN);
const cleaner_Schema = require("../models/cleanerModel");

module.exports = (app) => {
  app.get("/sendmessage/:type/:entranceName", async (req, res) => {
    try {
      let phoneNumbers = [];
      if (req.params.type == "SecurityTeam") {
        const security = await cleaner_Schema
          .find({ role: "Security Team" }, { phoneNumber: 1 })
          .lean();
        phoneNumbers = security.map((ele) => ele.phoneNumber);
      } else if (req.params.type == "CleaningTeam") {
        const cleaning = await cleaner_Schema
          .find({ role: "Cleaning Team" }, { phoneNumber: 1 })
          .lean();
        phoneNumbers = cleaning.map((ele) => ele.phoneNumber);
      }
      // console.log(phoneNumbers);
      //   Promise.all(
      //     phoneNumbers.map((number) => {
      //       client.messages
      //         .create({
      //           to: number,
      //           from: "+15713843536",
      //           body: `Potential case suspected at ${req.params.entranceName}`,
      //         })
      //         .then(() => res.status(200).send("Message has been Sent."))
      //         .catch((err) => res.status(406).send(err));
      //     })
      //   );

      // phoneNumbers.map((number) => {
      //   console.log(number);
      // });

      

      Promise.all(
        phoneNumbers.map((number) => {
          //   console.log(number);
          return client.messages.create({
            to: number,
            from: "+15713843536",
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
          res.status(406).send(err);
        });
    } catch (err) {
      res.status(406).send(err);
    }
  });
};
