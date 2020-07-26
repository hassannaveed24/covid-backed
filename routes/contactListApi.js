const contactListSchema = require("../models/contactListModel"),
  errorHandler = require('../controller/errorHandler');

module.exports = (app) => {
  // Insert API
  app.post("/api/addContact", async (req, res) => {
    try {
      delete req.body.index;

      let max = await contactListSchema.findOne({}, 'index').sort({ 'index': -1 }).lean();

      req.body.index = max ? ++max.index : 1;

      let myData = new contactListSchema(req.body);

      myData.save((err, data) => {
        if (err)
          return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        res.status(200).send(data);
      });
    } catch (err) {
      res.status(406).send({ message: errorHandler.getErrorMessage(err) });
    }
  });

  // GET API
  app.get("/api/viewContact", async (req, res) => {
    try {
      const contact = await contactListSchema.find().sort("index").lean();
      res.status(200).send(contact);
    } catch (err) {
      res.status(406).send({ message: errorHandler.getErrorMessage(err) });
    }
  });

  // Delete API
  app.delete("/api/deleteContact/:id", async (req, res) => {
    try {
      const oldContact = await contactListSchema.findByIdAndRemove(req.params.id).lean();

      if (!oldContact)
        return res.status(406).send({ message: "Record has already been deleted" });

      await contactListSchema.updateMany({ index: { $gte: oldContact.index } }, { $inc: { index: Number(-1) } }).lean();

      res.status(200).send("Deleted")

    } catch (err) {
      return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
    }
  });

  app.get("/api/contact/:id", async (req, res) => {
    try {
      let record = new Promise((resolve, reject) => {
        contactListSchema.findById(req.params.id).lean().exec((err, data) => {
          if (err)
            return reject({ message: errorHandler.getErrorMessage(err) });
          resolve(data);
        });
      });

      let swappableWith = new Promise((resolve, reject) => {
        contactListSchema.find({ _id: { $ne: req.params.id } }, 'index').lean().exec((err, data) => {
          if (err)
            return reject({ message: errorHandler.getErrorMessage(err) });
          resolve(data);
        });
      });

      Promise.all([record, swappableWith])
        .then((values) => {
          res.status(200).send({ record: values[0] || [], swappableWith: values[1].map(ele => ele.index) })
        }).catch((err) => {
          res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        });


    } catch (err) {
      res.status(406).send(err);
    }
  })


  //Update API
  app.put("/api/updateContact", async (req, res) => {
    try {

      //if no id is given to update
      if (!req.body._id)
        return res.status(406).send({ message: "No unique id found in request" });

      let actualRecord = req.body;

      if (actualRecord.swapwith) {
        let swapwith = await contactListSchema.findOne({ index: req.body.swapwith });
        if (!swapwith)
          return res.status(406).send({ message: "No a valid priority to swap" });

        let temp = swapwith.index;
        swapwith.index = actualRecord.index;
        actualRecord.index = temp
        swapwith.save();
      } else
        delete actualRecord.index;

      contactListSchema.findOneAndUpdate({ _id: actualRecord._id }, actualRecord, { new: true, runValidators: true, context: 'query' }, (err, data) => {
        if (err)
          return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        res.status(200).send(data);
      });
    } catch (err) {
      return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
    }
  });
}