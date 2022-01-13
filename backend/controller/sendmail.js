const Otp = require('../models/otp');
const User = require('../models/user');
//const bcrypt = require('bcrypt');

exports.otp = async(req,res)=>{
    try{
        var err;
    //console.log(req.body.email);
    let data = await User.findOne({email:req.body.email});
   // const responseType = {};
    if(data){
        let otpcode = Math.floor((Math.random()*10000)+1);
        let otpData = new Otp({
            email:req.body.email,
            code:otpcode,
            expireIn:new Date().getTime() + 300 * 1000
        })
        const isMatch = await otpData.save();
        if(!isMatch){
            res.status(400).json({error:'invalid credientials'})
        }else{
            res.json({message:'user login successfully'});
        }
}else{
    res.status(400).json({error:"invalid credientials"});
}          
}catch(err){
    console.log(err);
}
}

exports.sendmail = (req,res)=>{
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
}

exports.resetpassword = async(req,res)=>{
    //res.send('hello reset password');
   // var {password}=req.body;
   //console.log(req.body.code);
    let data = await Otp.find({email:req.body.email,code:req.body.code})
    //var err;
    const response ={}
    console.log(data);
    if(data){
        let currentTime =new Date().getTime();
        let diff = data.expireIn - currentTime;
        //console.log(diff);
        if(diff != 0){
            //res.json({message:'otp expired'});
            res.status(400).json({error:'otp expired'})
        }
       else{
            let user = await User.findOne({email:req.body.email});
            user.password =  req.body.password;
            res.status(200).json({message:'successfullyy'})
        }
    }else{
        res.status(400).json({error:'invalid otp'})
    }
    
}