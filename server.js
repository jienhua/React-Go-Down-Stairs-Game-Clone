var express    = require('express');
var path       = require('path');
var fs         = require('fs');  
var bodyParser = require('body-parser'); 
var app        = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/scoreBoard', (req, res) => {
	fs.readFile('./scoreBoard.json', 'utf8', (err, data)=>{
		if(err){
			return res.send('error');
		}
		res.json(JSON.parse(data));
	})
})

app.post('/scoreBoard', (req, res)=> {
	
	fs.readFile('./scoreBoard.json', 'utf8', (err, data)=>{
		if(err){
			return res.send('error');
		}
		
		data = JSON.parse(data).top10
		
		data.push({
			"name": req.body.name,
			"score": req.body.score
		})
		
		data.sort((a,b) => {
			return b.score-a.score;
		})

		if(data.length > 10){
			data = data.slice(0,10);
		}

		fs.writeFile('./scoreBoard.json', JSON.stringify({"top10":data}), (err)=>{
			if(err){
				return res.send('writing error');
			}
			res.send({"top10":data});
		})
	})
})

var PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log('server running at localhost: ' + PORT)
})

