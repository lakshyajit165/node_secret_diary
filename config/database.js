if(process.env.NODE_ENV === 'production'){
	module.exports = {
		mongoURI: 'mongodb://LK:lk@123@ds131963.mlab.com:31963/secret-diary'
	}
}else{
	module.exports = {
		mongoURI: 'mongodb://localhost/vidjot-dev'
	}
}