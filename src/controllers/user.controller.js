import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {User} from "../models/user.model.js";

const registerUser = asyncHandler(async(req,res)=>{
    // get user details from frontend
    // validate - not empty
    // check if user already exists or not 
    // check for images , check for avatar
    // upload them on cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response
    const {fullname,username,email,password} = req.body;
      if([fullname,username,email,password].some((field)=> field?.trim()==="")){
              throw new apiError(400,"All Fields are required")
      }
      const existingUsername = User.findOne({username});
        
      if(existingUsername){
        throw new apiError(409,"Username already exist");
      }

      const existingEmail = User.findOne({email});
      if(existingEmail){
        throw new apiError(409,"Email already exists");
      }
})

export {registerUser};