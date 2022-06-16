const mongoose = require('mongoose');
const { Schema } = mongoose;
const { isEmail } = require('validator');

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Username can't be blank"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        index: true,
        validate: [isEmail, 'Invalid email']
    },
    password: {
        type: String,
        required: [true, 'password is required'],        
    },
    picture: {
        type: String,
    },
    newMessages: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        default: 'online'
    }
}, {minimize: false})

const User = mongoose.model('user', UserSchema);
module.exports = User;