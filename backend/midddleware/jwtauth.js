const jwt = require('jsonwebtoken');
const User = require("../models/user");
const config = require('../config.json');

const Authenticate = async(req,res,next)=>{
	try{
			const token = req.cookies.jwtoken;
			const verifyToken = jwt.verify(token,config.secret)

			const rootUser = await User.findOne({_id:verifyToken._id,"tokens:token":token});
			if(!rootUser){throw new Error('User not Found')}
			req.token = token;
			req.rootUser = rootUser;
			req.userID = rootUser._id;
			next();
	}catch(err){
		res.status(401).send('Unautharized:no token provider')
		console.log(err);
	}
}
module.exports = Authenticate;