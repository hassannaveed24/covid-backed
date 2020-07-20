const config = require('../config');
const client = require('twilio')(config.app.SID, config.app.TOKEN)
const cleaner_Schema = require('../models/cleanerModel');

module.exports = app => {
    app.get('/sendmessage/:type/:entranceName', async (req, res) => {
        try {
            let phoneNumber = []
            if (req.params.type == "SecurityTeam") {
                const security = await cleaner_Schema.find({ role: "Security Team" }, { phoneNumber: 1 }).lean();
                phoneNumber = security.map((ele) => ele.phoneNumber)
            } else if (req.params.type == "CleaningTeam") {
                const cleaning = await cleaner_Schema.find({ role: "Cleaning Team" }, { phoneNumber: 1 });
                phoneNumber = cleaning.map((ele) => ele.phoneNumber)
            }
            client.messages.create({
                to: phoneNumber,
                from: '+15713843536',
                body: `Potential case suspected at ${req.params.entranceName}`
            })
                .then(() => res.status(200).send('Message has been Sent.'))
                .catch((err) => res.status(406).send(err))
        } catch (err) {
            res.status(406).send(err)
        }

    }
    )

}