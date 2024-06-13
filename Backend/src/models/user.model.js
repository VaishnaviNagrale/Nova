import mongoose from "mongoose";
import jwt from "jsonwebtoken"; // this is a library that generates tokens
import bcrypt from "bcrypt"; // this is a library that hashes passwords

// this is the schema for the user model
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true,'Username is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true,'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: [true,'Fullname is required'],
        trim: true,
        index: true,
    },
    avatar: {
        type: String, // cloudinary URL
        required: [true,'Avatar is required'],
    },
    coverImage: {
        type: String, // cloudinary URL
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true,'Password is required'],
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

// this is a pre hook that runs before the user is saved to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


// this is a method that checks if the password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password,this.password)
}

// jwt is bearer token which is used to authenticate the user

// this is a method that generates the access token using the jwt library
userSchema.methods.generateAccessToken = async function () {
   return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// this is a method that generates the refresh token using the jwt library
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)