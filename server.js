var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

var PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log('server running at localhost: ' + PORT)
})

