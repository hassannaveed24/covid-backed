const cleaner_Schema = require("../models/cleanerModel");

module.exports = (app) => {
  app.post("/addCleaner", async function (req, res) {
    try {
      const { email, role } = req.body;
      const check = await cleaner_Schema.countDocuments({
        email,
        role,
      });
      if (check) {
        res.status(400).send({
          error: {
            message: "Email is not valid or Already Exist",
          },
        });
      } else {
        var myData = new cleaner_Schema(req.body);
        console.log(JSON.stringify(req.body));
        console.log("MY Data" + JSON.stringify(myData));
        myData
          .save()
          .then((item) => {
            res.status(200).send({
              sucess: {
                message: "Sucessfully Saved",
              },
            });
          })
          .catch((err) => {
            res.status(400).send({
              error: {
                message: "Unable to save",
                error: err,
              },
            });
          });
      }
    } catch (err) {
      res.status(406).send(err);
    }
  });

  app.get("/viewCleaner", async function (req, res) {
    try {
      let cleaner = {};
      cleaner = await cleaner_Schema.find({}, function (err, cleaner) {});
      res.send(cleaner);
    } catch (err) {
      res.status(406).send(err);
    }
  });
  app.get("/viewOneCleaner/:_id", async function (req, res) {
    try {
      let cleaner = [];
      console.log("Body", req.params);
      var cleanerID = req.params._id;
      cleaner = await cleaner_Schema.findById({ _id: cleanerID }, function (
        err,
        cleaner
      ) {});
      res.send(cleaner);
    } catch (err) {
      res.status(406).send(err);
    }
  });

  app.delete("/deleteCleaner/:id", function (req, res) {
    try {
      const id = req.params.id;
      console.log(`ID is ${id}`);
      cleaner_Schema.deleteOne({ _id: id }, function (err, resp) {
        if (err) {
          res.status(400).send({
            error: {
              message: "Unable to delete",
              error: err,
            },
          });
        } else if (resp) {
          res.status(200).send({
            sucess: {
              message: "Sucessfully Deleted",
            },
          });
        }
      });
    } catch (err) {
      res.status(406).send(err);
    }
  });

  app.post("/updateCleaner", async (req, res) => {
    try {
      const { _id, fullName, email, role, phoneNumber } = req.body;

      const cleaner = await cleaner_Schema.findByIdAndUpdate(
        _id,
        {
          fullName,
          email,
          role,
          phoneNumber,
        },
        { new: true }
      );
      if (!cleaner)
        return res
          .status(404)
          .send("The security/cleaner with the given ID not found.");

      res.status(200).send(cleaner);
    } catch (err) {
      res.status(406).send(err);
    }
  });
};
