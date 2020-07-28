const ticket = require("../models/tickets");
const moment = require("moment");

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
      const newCases = await ticket.find({ status: "new" });
      const activeTests = await ticket.find({ floor: "2" });
      const myTickets = await ticket.find({ locationName: "front" });

      const timeDiff = (item) => {
        const currentTime = moment();
        const timeStore = moment(item.timestamp);
        return currentTime.diff(timeStore, "h");
      };

      const newCasesToday = newCases.filter((x) => timeDiff(x) <= 24);
      const activeTestsToday = activeTests.filter((x) => timeDiff(x) <= 24);
      const myTicketsToday = myTickets.filter((x) => timeDiff(x) <= 24);

      const newCasesPoints = Array(8).fill({ interval: "", cases: 0 });
      const getHour = (i) => (i > 9 ? `${i}:00` : `0${i}:00`);
      const getInterval = (i) => `${getHour(i * 3)} - ${getHour((i + 1) * 3)}`;

      newCasesToday.forEach((x) => {
        const i = timeDiff(x.timestamp) / 3;
        newCasesPoints[i] = {
          interval: getInterval(i),
          cases: newCasesPoints[i].cases + 1,
        };
      });

      const activeTestsPoints = Array(8).fill({ interval: "", cases: 0 });
      activeTestsToday.forEach((x) => {
        const i = timeDiff(x.timestamp) / 3;
        activeTestsPoints[i] = {
          interval: getInterval(i),
          cases: activeTestsPoints[i].cases + 1,
        };
      });

      const myTicketsPoints = Array(8).fill({ interval: "", cases: 0 });
      myTicketsToday.forEach((x) => {
        const i = timeDiff(x.timestamp) / 3;
        myTicketsPoints[i] = {
          interval: getInterval(i),
          cases: myTicketsPoints[i].cases + 1,
        };
      });

      const response = {
        newCases: {
          total: newCases.length,
          today: newCasesToday.length,
          chart: newCasesPoints,
        },
        activeTests: {
          total: activeTests.length,
          today: activeTestsToday.length,
          chart: activeTestsPoints,
        },
        myTickets: {
          total: myTicketsPoints.length,
          today: myTicketsToday.length,
          chart: myTicketsPoints,
        },
      };

      res.status(200).send(response);
    } catch (err) {
      res.status(406).send(err);
    }
  });
};
