const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

const app = express();

//Load Routes
const diary = require('./routes/diary');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');
//Connect to Mongoose
mongoose.connect(db.mongoURI,{
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

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//method-override middleware
app.use(methodOverride('_method'));

// Use the Express session middleware
app.use(session({ 
	secret: 'secret', 
	resave: true,
	saveUninitialized: true
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash middleware
app.use(flash());

//Global Variables
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
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