const ticket = require("../models/tickets"),
    errorHandler = require('../controller/errorHandler'),
    config = require("../config/config");



module.exports = async (app, io) => {

    let waitingQueue = [];

    app.get('/api/nextTicket', async (req, res) => {
        try {
            // if waiting queue is emmpty             
            if (!waitingQueue.length)
                return res.status(204).send("No Potential case has reached Kiosk 2");

            //fo rnow usign array, later will use queue

            let CurrTicket = waitingQueue.pop();

            ticket.find({ user_id: CurrTicket.user_id, status: 'close', }).sort('-timestamp').lean().exec((err, data) => {
                if (err)
                    return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
                // data.unshift(CurrTicket)

                res.status(200).send({ records: data, property: config.propertyDetails, triggerAt: new Date(), roomId : 'xyz223' });
                ticket.findByIdAndUpdate({ _id: CurrTicket._id }, { status: 'open', triggerAt: new Date() }).exec();
            })
            // console.log(ticket)
        } catch (err) {
            console.log(err)
            res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        }
    })

    // UserId/ TicketId 
    // kioskId
    app.post('/api/updateQueue', async (req, res) => {
        try {
            if (!req.body.userId && !req.body.kioskId)
                res.status(406).send({ message: "You Can't submit a request without userid and kioskId" });

            ticket.findOne({ user_id: req.body.userId, status: 'new' }).sort('-timestamp').lean().exec((err, data) => {
                if (err)
                    return res.status(406).send({ message: errorHandler.getErrorMessage(err) });
                if (data)
                    waitingQueue.push(data);
                else
                    console.log("no ticket found to push");
                res.end()
            });

        } catch (err) {
            console.log(err)
            res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        }
    })

    app.patch('/api/ticket/:ticketId/close', async (req, res) => {
        try {
            ticket.findById(req.params.ticketId, (err, data) => {
                if (err)
                    return res.status(406).send({ message: errorHandler.getErrorMessage(err) });

                if (data.status != 'open')
                    return res.status(406).send({ message: "You can't close a ticket which is not openned yet" });

                data.status = 'close';
                data.closedAt = new Date();
                // data.agent_id = "" will add from JWT


                data.save();
                res.status(200).send("Closed")

            })

        } catch (err) {
            console.log(err)
            res.status(406).send({ message: errorHandler.getErrorMessage(err) });
        }
    })

};
