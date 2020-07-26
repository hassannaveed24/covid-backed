const User = require("../models/userModel"),
  bcrypt = require("bcrypt"),
  errorHandler = require('../controller/errorHandler');

module.exports = (app) => {
  app.post("/api/adduser", async (req, res) => {
    try {
      const { email, role } = req.body;
      if (!req.body.password)
        return res.status(406).send({ message: "Password is Required" });
        
      const check = await User.countDocuments({ email, role });
      if (check)
        return res.status(406).send({ message: "Email already exists" });

      var myData = new User(req.body);
      const password = myData.password;
      bcrypt.hash("password", 10, function (err, hash) {
        if (err)
          return res.status(406).send({ message: errorHandler.getErrorMessage(err) });

        myData.password = hash;
        myData.save((err, data) => {
          if (err)
            return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
          res.status(200).send(data);
        });
      });
    } catch (err) {
      res.status(406).send(err);
    }
  });

  app.get("/api/allusers", async function (req, res) {
    try {
      User.find({}, '-password').lean().exec((err, data) => {
        if (err)
          return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        res.status(200).send(data);
      });
    } catch (err) {
      res.status(406).send(err);
    }
  });

  app.delete("/api/deleteUser/:id", function (req, res) {
    try {
      const id = req.params.id;

      User.deleteOne({ _id: id }).exec((err, data) => {
        if (err)
          return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        res.status(200).send("Deleted");
      });
    } catch (err) {
      res.status(406).send(err);
    }
  });

  app.post("/api/updateUser", async function (req, res) {
    try {
      const { _id, fullName, email, role, phoneNumber } = req.body;
      if (!_id)
        return res.status(406).send({ message: "No unique id found in request" });

      if (req.body.password) {
        const password = req.body.password;
        req.body.password = await bcrypt.hash("password", 10);
      }

      User.findByIdAndUpdate(_id, req.body, { new: true }).lean().exec((err, data) => {
        if (err)
          return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        delete data.password;
        res.status(200).send(data);
      });

    } catch (err) {
      res.status(406).send(err);
    }
  });
};
