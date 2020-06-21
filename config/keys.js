module.exports = {
	mongoURI: `mongodb+srv://${process.env.MONGO_USERNAME}:${
		process.env.MONGO_PASSWORD
	}@cluster0-pxge0.mongodb.net/${
		process.env.MONGO_DB_NAME
	}?retryWrites=true&w=majority`
};
