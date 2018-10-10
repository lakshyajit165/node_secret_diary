const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{
	useNewUrlParser: true
})
.then(() => {
	console.log('MongoDB Connected!');
})
.catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const idea = mongoose.model('ideas');


//HandleBars Middleware
app.engine('handlebars', 
	exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//method-override middleware
app.use(methodOverride('_method'));

//index route
app.get('/', (req,res)=>{
	const title = 'Welcome'
	res.render('index', {
		title:title
	});
});

//About Route
app.get('/about', (req,res) =>{
	res.render('about');
});

//Scribble Page
app.get('/scribbles', (req,res) => {
	idea.find({})
	.sort({date:'desc'})
	.then(ideas =>{
		res.render('diary/index',{
			ideas:ideas
		});
	});
	
});
//Add Scribble Form
app.get('/diary/add', (req,res) =>{
	res.render('diary/add');
});

//Edit Scribble Form
app.get('/diary/edit/:id', (req,res) =>{
	idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		res.render('diary/edit', {
			idea: idea
		});	
	});
	
});

//Process Form
app.post('/scribbles', (req,res) => {

	let errors = [];

	if(!req.body.title){
		errors.push({text:'Please add Title!'});
	}
	if(!req.body.details){
		errors.push({text:'Please add some content!'});
	}

	if(errors.length > 0){
		res.render('diary/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		});
	}else{
		const newUser = {
			title: req.body.title,
			details: req.body.details
		}
		new idea(newUser)
		.save()
		.then(idea => {
			res.redirect('/scribbles');
		})
	}
});

//Editing Scribble
app.put('/diary/:id', (req, res) =>{
	idea.findOne({
		_id: req.params.id
	})
	.then(idea =>{
		//new values	
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
		.then(idea => {
			res.redirect('/scribbles');
		})
	});
});

//Delete Idea
app.delete('/diary/:id', (req,res)=>{
	idea.remove({_id: req.params.id})
	.then(() => {
		res.redirect('/scribbles');	
	});	
});
const port = 5000 || process.env.PORT;

app.listen(port, () => {
	console.log(`Server start on port ${port}`);
});