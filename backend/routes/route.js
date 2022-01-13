const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const sendmail = require('../controller/sendmail');
const jwtauth = require('../midddleware/jwtauth');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const nodemailer = require('nodemailer');
//const Otp = require('../models/otp')

router.use(cookieParser('secret'));
router.use(session({
  secret : 'secret',
   maxAge : 3600000,
   resave : true,
   saveUninitialized : true
}))

router.use(passport.initialize());
router.use(passport.session());

//checkauthnetication 
const checkAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.set('cache-control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0')
        return next();
    } else {
        res.redirect('/login')
    }
}



router.get('/:id',userController.getUsersId);
router.get('/',userController.getUsers);
router.post('/adduser',userController.addUser);
router.post('/loginuser',userController.loginUser);
router.post('/passportlogin',userController.postLogin);
router.put('/:id',userController.editUser);
router.delete('/:id',userController.deleteUsers);
router.post('/send-mail',sendmail.otp);
router.post('/resetpassword',sendmail.resetpassword);
//router.put('/:id',userController.resetPassword);


//jwt authentcation
router.get('/about',(req,res)=>{
    console.log('hello my about');
   // res.send(req.rootUser);
})


//send mail
router.post('/sendmail',(req,res)=>{
 
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'pnik2228@gmail.com',
          pass: ''
        }
    });
 
    var mailOptions = {
        from: 'patel221211@gmail.com',// sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line
        text:req.body.description,
        html: `
        <div style="padding:10px;border-style: ridge">
        <p>You have a new contact request.</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Email: ${req.body.to}</li>
            <li>Subject: ${req.body.subject}</li>
            <li>Message: ${req.body.description}</li>
        </ul>
        `
    };
     
    transporter.sendMail(mailOptions, function(error, info){
        if (error)
        {
          res.json({status: true, respMesg: 'Email Sent Successfully'})
        } 
        else
        {
          res.json({status: true, respMesg: 'Email Sent Successfully'})
        }
     
      });
});
module.exports = router;