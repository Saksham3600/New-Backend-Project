import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const userShema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index:true,
        },
        avatar:{
            type: String,
            required: true,
        },
         coverImage:{
            type: String,
         },
         watchHistory:[
            {
            type: Schema.Types.ObjectId,
            ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true,'pass is required']
        },
        refreshToken:{
            type: String
        }

    },
    {
        timestamps: true
    }
)

userShema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
})

userShema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userShema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this.id,
            username: this.username,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userShema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const user = mongoose.Model("User",userShema )