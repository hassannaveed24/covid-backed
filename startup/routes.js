const bodyParser = require("body-parser");

module.exports = (app, io) => {
  app.use(bodyParser.json());

  require("../db/conn");

  app.get('/', async (req, res) => {
    res.status(200).send("Server is Working");
  });

  require("../routes/potentialPatientAPI")(app, io);

  // CRUD Cleaner's API
  require("../routes/cleanerAPI")(app);

  // CRUD Property Manager, Employee, Security Officer
  require("../routes/propertyManagerAPI")(app);

  //twillio API
  require("../routes/twilioAPI")(app);

  // Contact List API
  require("../routes/contactListApi")(app);

  // Notes API
  require("../routes/noteAPI")(app);

  require("../routes/thresholdAPI")(app);

  require("../routes/mediasoupAPI")(app);

  /**
   * Error handler.
   */
  app.use((error, req, res, next) => {
    if (error) {
      // logger.warn("Express app %s", String(error));

      error.status = error.status || (error.name === "TypeError" ? 400 : 500);

      res.statusMessage = error.message;
      res.status(error.status).send(String(error));
    } else {
      next();
    }
  });
};
