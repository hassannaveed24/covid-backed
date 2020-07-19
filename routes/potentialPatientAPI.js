const potentialPatient_Schema = require('../models/potentialPatientModel');

module.exports = async (app,io) => {
//    const http = await require("http").createServer(app).listen(8080)
//     const io = require("socket.io")(http, {
//         transports: ["websocket", "polling"],
//     })

    // get all potential casses
    app.get('/api/getPotentialCase',async function(req,res){
        try{
            const potentialPatient = await potentialPatient_Schema.find().lean();
            res.status(200).send(potentialPatient);
        }catch(err){
            res.status(406).send(err);
        }        
    })

    //called by resberry pie, and this api will notify clients about newer data
    app.post('/api/potentialcase', async function(req, res){
        try{
            let potentialPatient = new potentialPatient_Schema(req.body);
            potentialPatient.save();
            res.status(200).send(potentialPatient);
           // const potentialPatients = await potentialPatient_Schema.find();
            io.sockets.emit('broadcastPotentialPatient', potentialPatient);
        }catch(err){
            res.status(406).send(err);
        }
        
    })
}