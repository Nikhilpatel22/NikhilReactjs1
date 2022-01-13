const mongoose =require("mongoose");
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    code: {
        type: String,
    },
    expirein: {
        type: Number,
    },
},
{
    timestamps:true
});

module.exports = mongoose.model('otp', otpSchema);