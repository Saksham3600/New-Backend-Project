import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";



const registerUser = asyncHandler( async(req, res) =>{
   const { fullname, email, password, username} = req.body 
   console.log("email :", email, "\npass: ", password)

   if(
    [fullname,username,password,email].some((fields)=> fields?.trim() ==="")
   )
   {
        throw new ApiError(400,"some fields are empty")
   }
//    await is added by me not hitesh
   const existedUser = await user.findOne({
    $or: [{  username },{ email }]
   })
   if(existedUser)
   {
        throw new ApiError(409,"user already exist")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400,"avatar is required field")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar)
   {
    throw new ApiError(400,"avatar is required field")
   }
   const User  = await user.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
   })

   const createdUser = await user.findById(User._id).select(
    "-password -refreshToken"
   )
   if(!createdUser){
    throw new ApiError(500,"something went wrong while registering user")
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered successfully")
   )

   console.log("everything till now works fine ")

})



export { registerUser }