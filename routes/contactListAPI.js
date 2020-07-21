const contactListSchema = require("../models/contactListModel");
module.exports = (app) => {
  // Insert API
  app.post("/addContact", async function (req, res) {
    try {
      let myData = new contactListSchema(req.body);
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
  app.delete("/deleteContact/:id", function (req, res) {
    try {
      const id = req.params.id;
      contactListSchema
        .deleteOne({ _id: id })
        .then((resp) => {
          res.status(200).send({
            sucess: {
              message: "Sucessfully Deletec",
            },
          });
        })
        .catch((err) => {
          res.status(400).send({
            error: {
              message: "Unable to delete",
              error: err,
            },
          });
        });
    } catch (err) {
      res.error(406).send(err);
    }
  });
  // GET API
  app.get("/viewContact", async function (req, res) {
    try {
      let contact = {};
      contact = await contactListSchema
        .find({}, function (err, contact) {})
        .sort("index");
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

  app.post("/updateIndex", async (req, res) => {
    try {
      const numDoc = await contactListSchema.countDocuments();
      contactListSchema.find(
        {},
        { _id: 1, index: 1 },
        async (err, contactLIst) => {
          if (err) {
            console.log("Error 1", err);
          }

          let minValue = contactLIst[0].index;
          for (let i = 0; i < contactLIst.length; i++) {
            if (contactLIst[i].index < minValue) {
              minValue = contactLIst[i].index;
            }
          }
          const { newIndex, index, _id } = req.body;
          let aindex, anewindex;
          for (let i = 0; i < contactLIst.length; i++) {
            if (contactLIst[i].index == index) {
              aindex = i;
            }
            if (contactLIst[i].index == newIndex) {
              anewindex = i;
            }
          }
          let returnArray = array_move(contactLIst, aindex, anewindex);

          for (let i = 0; i < contactLIst.length; i++) {
            returnArray[i].index = minValue;
            minValue++;
          }

          for (let i = 0; i < returnArray.length; i++) {
            await contactListSchema.findByIdAndUpdate(
              { _id: returnArray[i]._id },
              { index: returnArray[i].index }
            );
          }
          res.status(200).send({
            sucess: {
              message: "Sucessfully Updated",
            },
          });
        }
      );
      array_move = (arr, old_index, new_index) => {
        if (new_index >= arr.length) {
          let k = new_index - arr.length + 1;
          while (k--) {
            arr.push(undefined);
          }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr; // for testing
      };
    } catch (err) {
      res.error(406).send(err);
    }
  });
};
