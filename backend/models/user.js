const mongoose =require("mongoose");
const jwt = require('jsonwebtoken');
const config = require('../config.json');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    password:{
        type:String,
    },
    file:{
        type:String,
    },
    tokens:[
            {
                token:{
                    type:String,
                    required:true
                }
            }
        ]
});

//generating jwt token

userSchema.methods.generateAuthToken = async function(){
     try{
        // let secret = 'secret';
         let token = jwt.sign({_id:this._id},config.secret); 
            this.tokens = this.tokens.concat({token : token});
            await this.save();
            return token;
        }catch(err){
         console.log(err);
     }
}


module.exports = mongoose.model('User', userSchema);