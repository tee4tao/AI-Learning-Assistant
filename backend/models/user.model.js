import mongoose from "mongoose";

const {Schema} = mongoose;

const userSchema = new Schema({
    username:{
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        minLength: [3, 'Username must be at least 3 characters long'],
        trim: true
    },
    email:{
        type: String,
        required: [true, 'Please provide an email'],
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        unique: true,
        lowercase: true,
        index: true
    },
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        minLength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    profileImage: {
        type: String,
        default: null
    }
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema);

export default User;