const cleaner_Schema = require("../models/cleanerModel"),
  errorHandler = require('../controller/errorHandler');

module.exports = (app) => {

  app.post("/api/addCleaner", async function (req, res) {
    try {
      const { email, role } = req.body;
      const check = await cleaner_Schema.countDocuments({ email, role });
      if (check)
        return res.status(406).send({ message: "Email is not valid or Already Exist" });

      var myData = new cleaner_Schema(req.body);

      myData.save((err, data) => {
        if (err)
          return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        res.status(200).send(data);
      });

    } catch (err) {
      console.log(err)
      res.status(406).send({ message: errorHandler.getErrorMessage(err) });
    }
  });


  app.get("/api/viewCleaner", async function (req, res) {
    try {
      let cleaner = await cleaner_Schema.find({}).lean();
      res.status(200).send(cleaner);
    } catch (err) {
      res.status(406).send({ message: errorHandler.getErrorMessage(err) });
    }
  });

  app.get("/api/viewOneCleaner/:_id", async (req, res) => {
    try {
     
      cleaner_Schema.findById(req.params._id).lean().exec((err, data) => {
        if (err)
          return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        res.status(200).send(data);
      });
    } catch (err) {
      res.status(406).send(err);
    }
  });


  app.delete("/api/deleteCleaner/:id", function (req, res) {
    try {
      const id = req.params.id;
      cleaner_Schema.deleteOne({ _id: id }, function (err, resp) {
        if (err)
          return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        res.status(200).send("Sucessfully Deleted")
      });
    } catch (err) {
      res.status(406).send({ message: errorHandler.getErrorMessage(err) });
    }
  });

  app.post("/api/updateCleaner", async (req, res) => {
    try {
      if (!req.body._id)
        return res.status(406).send({ message: "No unique id found in request" });

      cleaner_Schema.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, data) => {
        if (err)
          return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        res.status(200).send(data);
      });

    } catch (err) {
      return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
    }
  });
};
