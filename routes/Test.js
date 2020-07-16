module.exports = app => {
    app.get('/api/test', async(req, res) => {
		const testdata = {"id": "1234"};
		res.send(testdata);
	});
	
}

