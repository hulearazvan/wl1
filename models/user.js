const mongoose = require('mongoose');

//User schema
let userSchema = mongoose.Schema({
    firstname:{
        type: String,
        required: true,
    },
    lastname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    userType:{
        type: String,
        required: false,
    },
    ref:{
        type: String,
        required: false,
    }
}, {collection: 'users'});

let User = module.exports = mongoose.model('User', userSchema);