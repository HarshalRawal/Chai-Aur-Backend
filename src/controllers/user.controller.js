import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/ApiResponse.js";
// get user details from frontend
    // validate - not empty
    // check if user already exists or not 
    // check for images , check for avatar
    // upload them on cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, username, email, password } = req.body;
    
    // Check if any of the required fields are empty
    if ([fullname, username, email, password].some((field) => field?.trim==="")){
        throw new apiError(400, "All fields are required");
    }
    
    // Check if a user with the same username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        if (existingUser.username === username) {
            throw new apiError(409, "Username already exists");
        } else if (existingUser.email === email) {
            throw new apiError(409, "Email already exists");
        }
    }
    
    if (!req?.files.avatar) {
        throw new apiError(400, "Avatar file is required")
    }
    const avatarLocalPath = req?.files?.avatar[0]?.path;

    if (!avatarLocalPath && !req.files.avatar[0].mimetype.includes('image')) {
        throw new apiError(400, "Avatar file is required or Invalid file Type")
    }

    let coverImageLocalPath;
    if (req?.files && Array.isArray(req?.files?.coverImage) && req?.files?.coverImage?.length > 0) {
        coverImageLocalPath = req?.files?.coverImage[0]?.path
    }
    
    // Upload files to Cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new apiError(400, "Avatar failed to upload on Cloudinary");
    }
    
    // Create user object and entry in the database
    const newUser = await User.create({
        fullname,
        avatar: avatar.url,
        username,
        email,
        coverImage: coverImage?.url || "",
        password,
    });
    
    // Retrieve the created user without sensitive fields
    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering user");
    }
    
    // Return the response
    res.status(201).json(new apiResponse(201, createdUser, "New User Created Successfully"));
});

export { registerUser };
