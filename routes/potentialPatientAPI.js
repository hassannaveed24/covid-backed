const ticket = require("../models/potentialPatientModel");

module.exports = async (app, io) => {
  //    const http = await require("http").createServer(app).listen(8080)
  //     const io = require("socket.io")(http, {
  //         transports: ["websocket", "polling"],
  //     })

  // get all potential casses
  app.get("/api/getPotentialCase", async (req, res) => {
    try {
      const potentialPatient = await ticket.find().sort("-timestamp").lean();
      res.status(200).send(potentialPatient);
    } catch (err) {
      res.status(406).send(err);
    }
  });

  //called by resberry pie, and this api will notify clients about newer data
  app.post("/api/potentialcase", async (req, res) => {
    try {
      const potentialPatient = new ticket(req.body);
      const record = await potentialPatient.save();
      res.status(200).send(record);
      // io.sockets.emit("broadcastPotentialPatient", record);
    } catch (err) {
      res.status(406).send(err);
    }
  });
};
