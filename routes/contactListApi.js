const contactListSchema = require("../models/contactListModel");
module.exports = (app) => {
  // Insert API
  app.post("/addContact", async (req, res) => {
    try {
      let myData = new contactListSchema(req.body);
      myData
        .save()
        .then(() => {
          res.status(200).send({
            sucess: {
              message: "Sucessfully Saved",
            },
          });
        })
        .catch((err) => {
          res.status(400).send({
            error: {
              message: "Unable to save data",
              error: err,
            },
          });
        });
    } catch (err) {
      res.status(406).send(err);
    }
  });
  // Delete API
  app.delete("/deleteContact/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const oldContact = await contactListSchema.findByIdAndRemove(id);
      const { index: oldIndex } = oldContact;

      const contacts = await contactListSchema.find().sort("index").lean();

      const updatedContacts = contacts.map(async (contact, i) => {
        const query = {
          index: { $lt: i + (2 + oldIndex), $gte: i + (1 + oldIndex) },
        };
        const update = {
          $set: { index: i + oldIndex },
        };
        await (await contactListSchema.findOneAndUpdate(query, update)).save();
      });

      await Promise.all(updatedContacts).then((result) =>
        res.status(200).send(result)
      );

      res.status(200).send({
        success: {
          message: "Succesfully Updated!",
        },
      });
    } catch (err) {
      res.status(406).send(err);
    }
  });
  // GET API
  app.get("/viewContact", async (req, res) => {
    try {
      const contact = await contactListSchema.find().sort("index").lean();
      res.send(contact);
    } catch (err) {
      res.status(406).send(err);
    }
  });
  //Update API
  app.post("/updateContact", async (req, res) => {
    try {
      const { id, role } = req.body;
      contactListSchema.findOneAndUpdate({ _id: id }, req.body, (err, doc) => {
        if (err) {
          res.status(400).send({
            error: {
              message: "Unable to Update",
              error: err,
            },
          });
        } else {
          res.status(200).send({
            sucess: {
              message: "Sucessfully Updated",
            },
          });
        }
      });
    } catch (err) {
      res.error(406).send(err);
    }
  });

  app.get("/updateIndex", async (req, res) => {
    try {
      const selectedIndex = 6;
      const updatedIndex = 3;

      if (selectedIndex > updatedIndex) {
        const arr1 = await contactListSchema
          .find({
            index: { $lte: updatedIndex },
          })
          .sort("index")
          .lean();
        const arr2 = await contactListSchema
          .find({
            index: { $gt: updatedIndex, $lt: selectedIndex },
          })
          .sort("index")
          .lean();
        const arr3 = await contactListSchema
          .find({
            index: { $gt: selectedIndex },
          })
          .sort("index")
          .lean();
        res.status(200).send(arr3);
      } else if (selectedIndex < updatedIndex) {
        const arr1 = await contactListSchema
          .find({
            index: { $lt: selectedIndex },
          })
          .sort("index")
          .lean();

        const arr2 = await contactListSchema
          .find({
            index: { $gt: selectedIndex, $lt: updatedIndex },
          })
          .sort("index")
          .lean();

        const arr3 = await contactListSchema.find({
          index: { $gt: updatedIndex },
        });

        const selectedContact = await contactListSchema.find({
          index: selectedIndex,
        });

        const updatedContact = await contactListSchema.find({
          index: updatedIndex,
        });

        const input = [updatedContact, selectedContact];

        const newArr = [...arr1, ...arr2, ...input, ...arr3];

        res.status(200).send(newArr);
      }
    } catch (err) {
      res.status(406).send(err);
    }
  });
};
