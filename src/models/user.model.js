import { Mongoose, Schema } from "mongoose";

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        name: String,
        email: {
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
        phoneNumber: {
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        role: {
            type: String,
            enum: ["superAdmin", "owner", "manager", "staff"],
            default: "staff",
            required: true
        },
        subRole: {
            type: String,
            enum: ["supervisor", "general"],
            default: "general",
            required: function () {
                return this.role === "staff";
            }
        },
        category:{
            type:String,
            enum:["chef","waiter","receptionist","cleaning"],
            default:'',
            required:true
        },
        businessId : String,
        departmentId:String,
         refreshToken: {
            type: String
        },
        isActive:Boolean,
        isVerfied:Boolean
    },
    {
        timestamps:true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    
            
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name:this.name
        },
        process.env.ACCESS_TOKEN_SECERET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)