module.exports = app => {
	app.get('/', async (req, res) => {
		res.status(200).send("Server is Working");
	});
}

