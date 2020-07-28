const note_Schema = require("../models/noteModel"),
  errorHandler = require('../controller/errorHandler');

module.exports = (app) => {
  //Add Notes API
  app.post("/api/addNote", function (req, res) {
    try {
      const myData = new note_Schema(req.body);
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

  //#region 
  // //Delete Note API
  // app.delete("/deleteNote/:id", function (req, res) {
  //   try {
  //     const id = req.params.id;
  //     note_Schema
  //       .deleteOne({ _id: id })
  //       .then((resp) => {
  //         res.status(200).send({
  //           sucess: {
  //             message: "Sucessfully Deleted",
  //           },
  //         });
  //       })
  //       .catch((err) => {
  //         res.status(400).send({
  //           error: {
  //             message: "Unable to delete",
  //             error: err,
  //           },
  //         });
  //       });
  //   } catch (err) {
  //     res.status(406).send(err);
  //   }
  // });
  //#endregion

  //View All Notes API
  app.get("/api/viewNote/:ticketId", async (req, res) => {
    try {
      await note_Schema.find({ ticketId: req.params.ticketId }).populate({ path: 'userId', select: 'fullName' }).lean().exec((err, data) => {
        if (err)
          return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        res.status(200).send(data);
      });
    } catch (err) {
      console.log(err)
      res.status(406).send({ message: errorHandler.getErrorMessage(err) });
    }
  });

  //#region 

  // //Update API
  // app.post("/updateNote", async (req, res) => {
  //   try {
  //     const { _id, ticketNum, title, note, contact } = req.body;

  //     const notes = await note_Schema.findByIdAndUpdate(
  //       _id,
  //       {
  //         ticketNum,
  //         title,
  //         note,
  //         contact,
  //       },
  //       { new: true }
  //     );
  //     if (!notes)
  //       return res.status(404).send("The note with the given ID not found.");

  //     res.status(200).send(notes);
  //   } catch (err) {
  //     res.status(406).send(err);
  //   }
  // });
  //#endregion
};
