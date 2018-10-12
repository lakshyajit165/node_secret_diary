const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

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

// Use the Express session middleware
app.use(session({ 
	secret: 'secret', 
	resave: true,
	saveUninitialized: true
}));

//Connect flash middleware
app.use(flash());

//Global Variables
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});

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
app.get('/diary', (req,res) => {
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
app.post('/diary', (req,res) => {

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
			req.flash('success_msg','Scribble Added!');
			res.redirect('/diary');
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
			req.flash('success_msg','Scribble Updated!');
			res.redirect('/diary');
		})
	});
});

//Delete Idea
app.delete('/diary/:id', (req,res)=>{
	idea.deleteOne({_id: req.params.id})
	.then(() => {
		req.flash('success_msg','Scribble Removed!');
		res.redirect('/diary');	
	});	
});
const port = 5000 || process.env.PORT;

app.listen(port, () => {
	console.log(`Server start on port ${port}`);
});