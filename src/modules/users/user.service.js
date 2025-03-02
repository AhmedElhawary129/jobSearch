import * as dbService from "../../DB/dbService.js";
import { enumsActionCompany, enumsActionUser } from "../../DB/enums.js";
import {companyModel, userModel} from "../../DB/models/index.js";
import cloudinary from "../../utils/cloudinary/index.js";
import { asyncHandler, Encrypt, Hash, compare, AppError, Decrypt } from "../../utils/index.js";



// --------------------------------------User APIs--------------------------- =====> 

// update user account =====>
export const updateProfile = asyncHandler(async (req, res, next) => {
    if (!await dbService.findOne({model : userModel, filter : {_id : req.user._id, isDeleted : false}})) {
        return next (new AppError("User not exists or deleted", 400))
    }
    if (req.body.phone) {
        req.body.phone = await Encrypt({ key : req.body.phone, SECRET_KEY : process.env.SECRET_KEY})
    }
    // update user
    const user = await dbService.findByIdAndUpdate({
        model : userModel, 
        filter : {_id : req .user._id}, 
        update : req.body, 
        options : {new : true}
    })
        return res.status(201).json({ MSG: "DONE", user});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Get login user account data ======>
export const getProfileData = asyncHandler(async (req, res, next) => {
    if (!await dbService.findOne({model : userModel, filter : {_id : req.user._id, isDeleted : false}})) {
        return next (new AppError("User not exists or deleted", 400))
    }
    req.user.phone = await Decrypt({
        key: req.user.phone,
        SECRET_KEY: process.env.SECRET_KEY,
    });
        return res.status(201).json({ MSG: "DONE", user: req.user});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Get profile data for another use =====>
export const getProfile = asyncHandler(async (req, res, next) => {
    const {userId} = req.params;
    const user = await dbService.findOne({
        model : userModel, 
        filter : {_id : userId, isDeleted : false}, 
        select : ("firstName lastName phone profileImage coverImage -_id")
    })
    if (!user) {
        return next (new AppError("User not exists or deleted", 400))
    }
    user.phone = await Decrypt({
        key: user.phone,
        SECRET_KEY: process.env.SECRET_KEY,
    });
    return res.status(201).json({ MSG: "DONE", user});
})

//------------------------------------------------------------------------------------------------------------------------------------------

// update password =====>
export const updatePassword = asyncHandler(async (req, res, next) => {
    const {oldPassword, newPassword} = req.body
    
    if (!await dbService.findOne({model : userModel, filter : {_id : req.user._id, isDeleted : false}})) {
        return next (new AppError("Email not exists or deleted", 400))
    }
    
    if (!await compare({key : oldPassword, hashed : req.user.password})) {
        return next (new AppError("Invalid Old Password", 400))
    }
    const hash = await Hash({key : newPassword, SALT_ROUNDS : process.env.SALT_ROUNDS})
    
    // update user
    const user = await dbService.findByIdAndUpdate({
        model : userModel, 
        filter : {_id : req .user._id}, 
        update : {password : hash, changePasswordAt : Date.now()}, 
        options : {new : true}
    })
        return res.status(201).json({ MSG: "DONE", user});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Upload Profile Pic =====>
export const profileImage = asyncHandler(async (req, res, next) => {
    if (!await dbService.findOne({model : userModel, filter : {_id : req.user._id, isDeleted : false}})) {
        return next (new AppError("User not exists or deleted", 400))
    }
    if (!req?.file) {
    return next(new AppError("Please Upload image", 400))
    }

    if (req.file) {
        await cloudinary.uploader.destroy(req.user.profileImage.public_id)
    }
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder : "Exam/users/profileImage",
    })
    // update the user
    const user = await dbService.findByIdAndUpdate({
        model : userModel, 
        filter : {_id : req.user._id}, 
        update : {profileImage : {secure_url, public_id}}
    })
    return res.status(201).json({ MSG: "Profile Picture Uploaded Successfully", user});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Upload Cover  Pic =====>
export const coverImage = asyncHandler(async (req, res, next) => {
    if (!await dbService.findOne({model : userModel, filter : {_id : req.user._id, isDeleted : false}})) {
        return next (new AppError("User not exists or deleted", 400))
    }
    if (!req?.file) {
        return next(new AppError("Please Upload image", 400))
    }
    if (req.file) {
        await cloudinary.uploader.destroy(req.user.coverImage.public_id)
    }
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder : "Exam/users/coverImage",
    })
    // update the user
    const user = await dbService.findByIdAndUpdate({
        model : userModel, 
        filter : {_id : req.user._id}, 
        update : {coverImage : {secure_url, public_id}}
    })
    return res.status(201).json({ MSG: "Cover Picture Uploaded Successfully", user});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Delete Profile Pic =====>
export const deleteProfileImage = asyncHandler(async (req, res, next) => {
    const {userId} = req.params;
    if (!await dbService.findOne({
        model : userModel, 
        filter : {_id : req.user._id, isDeleted : false}
    })) {
        return next (new AppError("User not exists or deleted", 400))
    }
    if (userId != req.user._id) {
        return next (new AppError("User Not Found", 402))
    }
    await cloudinary.uploader.destroy(req.user.profileImage.public_id)
    return res.status(201).json({ MSG: "Profile Picture Deleted Successfully"});
});
//------------------------------------------------------------------------------------------------------------------------------------------

// Delete Profile Pic =====>
export const deleteCoverImage = asyncHandler(async (req, res, next) => {
    const {userId} = req.params;
    if (!await dbService.findOne({
        model : userModel, 
        filter : {_id : req.user._id, isDeleted : false}
    })) {
        return next (new AppError("User not exists or deleted", 400))
    }
    if (userId != req.user._id) {
        return next (new AppError("User Not Found", 402))
    }
    await cloudinary.uploader.destroy(req.user.coverImage.public_id)
    return res.status(201).json({ MSG: "Cover Picture Deleted Successfully"});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Soft delete account (freeze account) =====>
export const freezeAccount = asyncHandler(async (req, res, next) => {
    if (!await dbService.findOne({model : userModel, filter : {_id : req.user._id, isDeleted : false}})) {
        return next (new AppError("User not exists or deleted", 400))
    }
    const user = await dbService.findByIdAndUpdate({
        model : userModel, 
        filter : {_id : req.user._id}, 
        update : {isDeleted : true, passwordChangedAt : Date.now()}, 
        options :{new : true}
    })
        return res.status(201).json({ MSG: "DONE", user });
});

//------------------------------------------------------------------------------------------------------------------------------------------

// ----------------Admin Dashboard APIs----------=====>

// Ban or unbanned specific user =====>
export const banUser = asyncHandler(async (req, res, next) => {
    const {userId} = req.params;
    const {action} = req.body;
        
    const user = await dbService.findOne({
        model : userModel,
        filter : {
            _id : userId,
            isDeleted : false
    }
})
if (!user) {
    return next(new AppError("user not found or deleted or already banned", 403))
}
    let updateUser;
    if (action == enumsActionUser.banUser) {
        updateUser = await dbService.findOneAndUpdate({
            model : userModel, 
            filter : {_id : userId, isDeleted : false},
            update : {bannedAt : Date.now()},
            options : {new : true}
        })
    } else if(action == enumsActionUser.unBannedUser) {
        updateUser = await dbService.findOneAndUpdate({
            model : userModel, 
            filter : {_id : userId, isDeleted : false},
            update : {$unset : {bannedAt : 0}},
            options : {new : true}
        })
    }
    if (!updateUser) {
        return next(new AppError("user not found or deleted", 403))
    }
    return res.status(201).json({ MSG: `${action}`, user : updateUser});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Ban or unbanned specific company. =====>
export const banCompany = asyncHandler(async (req, res, next) => {
    const {companyId} = req.params;
    const {action} = req.body;
        
    const company = await dbService.findOne({
        model : companyModel,
        filter : {
            _id : companyId,
            isDeleted : false
    }
})
if (!company) {
    return next(new AppError("Company not found or deleted or already banned", 403))
}
    let updatecompany;
    if (action == enumsActionCompany.banCompany) {
        updatecompany = await dbService.findOneAndUpdate({
            model : companyModel, 
            filter : {_id : companyId, isDeleted : false},
            update : {bannedAt : Date.now()},
            options : {new : true}
        })
    } else if(action == enumsActionCompany.unBannedCompany) {
        updatecompany = await dbService.findOneAndUpdate({
            model : companyModel, 
            filter : {_id : companyId, isDeleted : false},
            update : {$unset : {bannedAt : 0}},
            options : {new : true}
        })
    }
    if (!updatecompany) {
        return next(new AppError("Company not found or deleted", 403))
    }
    return res.status(201).json({ MSG: `${action}`, company : updatecompany});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Approve company =====>
export const approveCompany = asyncHandler(async (req, res, next) => {
    const {companyId} = req.params;
        
    const company = await dbService.findOne({
        model : companyModel,
        filter : {
            _id : companyId,
            isDeleted : false,
            approvedByAdmin : false
    }
})
if (!company) {
    return next(new AppError("Company not found or deleted or already approved", 403))
}
        const updatecompany = await dbService.findOneAndUpdate({
            model : companyModel, 
            filter : {_id : companyId, isDeleted : false},
            update : {approvedByAdmin : true},
            options : {new : true}
        })
    if (!updatecompany) {
        return next(new AppError("Something error", 403))
    }
    return res.status(201).json({ MSG: "Company approved successfully", company : updatecompany});
});