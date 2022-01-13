const User = require("../models/user")
const bcrypt = require('bcrypt');
//const jwtauth = require('../midddleware/jwtauth');
const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.getUsers = async(req,res)=>{
        try{
                let user = await User.find();
                res.json(user);
        }catch(error){
                res.json({message : error.message})
        }
}

exports.getUsersId = async(req,res)=>{
    const id = req.params.id;
    try{
    const user = await User.findById(id);
    res.json(user);
    }catch(error){
        res.error({message: error.message});
    }

}


exports.addUser = function(req,res,next){
    var { name, email,phone, password,cpassword,file} = req.body;
    var err;
    if(password != cpassword){
        if(err)throw err;
    }else{
        bcrypt.hash(req.body.password, 10, (err, hash) => {
                      const user = new User({
                            name : req.body.name,
                            email : req.body.email,
                            phone : req.body.phone,
                            password : hash,
                            file: (req.file) ? req.file.filename :null,
                        })
                        user.save()
                        .then(()=>{
                            res.status(200).json({user})
                        })
                        .catch((err)=>{
                           res.status(400).json({message:error.message})
                        })
                    })   
 }
}

exports.loginUser = async(req,res)=>{
   try{
       //let token;
       const { email,password } =req.body;
       if (!email || !password){
           return res.status(400).json({error:'plz filled the data'})
       }
       const userlogin = await User.findOne({email:email});
       if(userlogin){

           const isMatch = await bcrypt.compare(password,userlogin.password);
        
          const token = await userlogin.generateAuthToken();
           
           console.log(token);

            res.cookie("jwtoken",token,{
            expires:new Date(Date.now() + 25892000000),
            secure: false,  
            httpOnly : true,
           })

           if(!isMatch){
           res.status(400).json({error:'invalid User'})
       }else{
           res.json({message:'user login successfully'});
       }
       }else{
           res.status(400).json({error:"invalid User"});
       }          
   }
   catch(err){
       console.log(err);
   }
}
 exports.editUser = async (req, res) => {
        let user = await User.findById(req.params.id);
        user = req.body;
    
        const editUser = new User(user);
        try{
            await User.updateOne({_id: req.params.id}, editUser);
            res.status(201).json(editUser);
        } catch (error){
            res.status(409).json({ message: error.message});     
        }
    
    }
    
    exports.deleteUsers = async (request, response) => {
        try{
            let user = await User.deleteOne({_id: request.params.id});
            response.status(201).json(user);
        } catch (error){
            response.status(409).json({ message: error.message});     
        }
    }


    exports.postLogin = (req, res, next) => {
        passport.authenticate('local', {
            failureRedirect: '/passportlogin',
            successRedirect: '/',
            failureFlash: true,
        })(req, res, next);
    };


// exports.resetPassword = async (req, res) => {
//         let user = await User.findById(req.params.id);
//         user = req.body;
    
//         const editUser = new User(user);
//         try{
//             await User.updateOne({_id: req.params.id}, editUser);
//             res.status(201).json(editUser);
//         } catch (error){
//             res.status(409).json({ message: error.message});     
//         }
    
//     }
    