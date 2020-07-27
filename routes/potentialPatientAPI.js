const moment = require("moment");
moment().format();
const ticket = require("../models/potentialPatientModel");

module.exports = async (app, io) => {
  // get all potential casses
  app.get("/api/getPotentialCase", async (req, res) => {
    try {
      const potentialPatient = await ticket.find().sort("-timestamp").lean();
      res.status(200).send(potentialPatient);
    } catch (err) {
      res.status(406).send(err);
    }
  });

  //  called by resberry pie, and this api will notify clients about newer data
  app.post("/api/potentialcase", async (req, res) => {
    try {
      const potentialPatient = new ticket(req.body);
      const record = await potentialPatient.save();
      res.status(200).send(record);
      io.sockets.emit("broadcastPotentialPatient", record);
    } catch (err) {
      res.status(406).send(err);
    }
  });

  app.get("/api/getChartData", async (req, res) => {
    try {
      const potentialPatient = await ticket.find().sort("-timestamp").lean();
      const newCases = potentialPatient.filter((x) => x.status === "new");
      const timeDiff = (item) => {
        const currentTime = moment();
        const timeStore = moment(item.timestamp);
        return currentTime.diff(timeStore, "h");
      };
      const newCasesToday = newCases.filter((x) => timeDiff(x) <= 24);

      const points = Array(8).fill(0);
      newCasesToday.forEach((x) => {
        const index = timeDiff(x.timestamp) / 3;
        points[index] += 1;
      });

      const response = {
        new: newCases.length,
        newToday: newCasesToday.length,
        newData: points,
      };

      res.status(200).send(response);
    } catch (err) {
      res.status(406).send(err);
    }
  });
};
