const note_Schema = require("../models/noteModel");

module.exports = (app) => {
  //Add Notes API
  app.post("/addNote", function (req, res) {
    try {
      const myData = new note_Schema(req.body);
      myData
        .save()
        .then((items) => {
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

  //Delete Note API
  app.delete("/deleteNote/:id", function (req, res) {
    try {
      const id = req.params.id;
      note_Schema
        .deleteOne({ _id: id })
        .then((resp) => {
          res.status(200).send({
            sucess: {
              message: "Sucessfully Deleted",
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
      res.status(406).send(err);
    }
  });

  //View All Notes API
  app.get("/viewNote", async (req, res) => {
    try {
      const notes = await note_Schema.find();
      res.send(notes);
    } catch (err) {
      res.status(406).send(err);
    }
  });

  //Update API
  app.post("/updateNote", async (req, res) => {
    try {
      const { _id, ticketNum, title, note, contact } = req.body;

      const notes = await note_Schema.findByIdAndUpdate(
        _id,
        {
          ticketNum,
          title,
          note,
          contact,
        },
        { new: true }
      );
      if (!notes)
        return res.status(404).send("The note with the given ID not found.");

      res.status(200).send(notes);
    } catch (err) {
      res.status(406).send(err);
    }
  });
};
