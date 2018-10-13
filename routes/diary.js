const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Load Idea Model
require('../models/Idea');
const idea = mongoose.model('ideas');


//Scribble Page
router.get('/', (req,res) => {
	idea.find({})
	.sort({date:'desc'})
	.then(ideas =>{
		res.render('diary/index',{
			ideas:ideas
		});
	});
	
});
//Add Scribble Form
router.get('/add', (req,res) =>{
	res.render('diary/add');
});

//Edit Scribble Form
router.get('/edit/:id', (req,res) =>{
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
router.post('/', (req,res) => {

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
router.put('/:id', (req, res) =>{
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
router.delete('/:id', (req,res)=>{
	idea.deleteOne({_id: req.params.id})
	.then(() => {
		req.flash('success_msg','Scribble Removed!');
		res.redirect('/diary');	
	});	
});


module.exports = router;