const mongoose = require('mongoose');

const db = "mongodb+srv://posuser:1234@posdb-0yxjw.mongodb.net/dca?retryWrites=true&w=majority";

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => 
      console.log("Connected to MongoDB..")
  ).catch(err => console.log(err));
