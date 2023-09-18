const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


// Define Schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // make sure email is unique
    }
});
//use code below to add username + password with built-in validations to Schema
userSchema.plugin(passportLocalMongoose); 


//EXPORTS
module.exports = mongoose.model("User", userSchema);