const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Load Routes
const diary = require('./routes/diary');
const users = require('./routes/users');

//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',{
	useNewUrlParser: true
})
.then(() => {
	console.log('MongoDB Connected!');
})
.catch(err => console.log(err));



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




//Use Routes
app.use('/diary',diary);
app.use('/users',users);

const port = 5000 || process.env.PORT;

app.listen(port, () => {
	console.log(`Server start on port ${port}`);
});