const bodyParser = require("body-parser");

module.exports = (app, io) => {
  app.use(bodyParser.json());

  require("../db/conn");

  app.get('/', async (req, res) => {
    res.status(200).send("Server is Working");
  });

  require("../routes/potentialPatientAPI")(app, io);

  require("../routes/cleanerAPI")(app);
  require("../routes/contactListApi")(app);
  require("../routes/noteAPI")(app);
  require("../routes/propertyManagerAPI")(app);
  require("../routes/thresholdAPI")(app);
  require("../routes/twilioAPI")(app);
  require("../routes/mediasoupAPI")(app);

  /**
   * Error handler.
   */
  app.use((error, req, res, next) => {
    if (error) {
      logger.warn("Express app %s", String(error));

      error.status = error.status || (error.name === "TypeError" ? 400 : 500);

      res.statusMessage = error.message;
      res.status(error.status).send(String(error));
    } else {
      next();
    }
  });
};
