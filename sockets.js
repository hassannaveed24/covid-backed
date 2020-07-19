exports.test = (async (client) => {


    console.log(client)
    client.on('testSocket', (req, res) => {
        console.log('Hello console.');
        res.send('hello');
    })

    // Setting Threshold by property manager
    client.on('saveThreshold', async req => {
        try {
            let threshold = new threshold_Schema(req.body);
            await threshold.save();
            threshold = await threshold_Schema.find();
            client.emit('broadcastThreshold', threshold);
        } catch (err) {
            console.log(err);
        }
    })
    client.emit('test123', "degege");


    // Disconnecting Socket
    client.on("disconnect", () => {
        console.log("Socket disconnected")
    })
})

