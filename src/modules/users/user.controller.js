import { Router } from "express";
import * as US from "./user.service.js";
import { authentication, authorization } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as UV from "./user.validation.js";
import { multerMost } from "../../middleware/multer.js";
import { fileTypes, roleTypes } from "../../DB/enums.js";

const userRouter = Router()



// user router =====>
userRouter.patch("/updateProfile", 
    validation(UV.updateProfileSchema),
    authentication,
    US.updateProfile)

userRouter.get("/profileData", authentication, US.getProfileData)
userRouter.get("/getProfile/:userId", US.getProfile)

userRouter.patch("/updatePassword", validation(UV.updatePasswordSchema), authentication, US.updatePassword)

userRouter.patch("/profileImage", 
    multerMost(fileTypes.image).single("attachment"), 
    validation(UV.imageSchema),
    authentication, 
    US.profileImage)

userRouter.patch("/coverImage", 
    multerMost(fileTypes.image).single("attachment"), 
    validation(UV.imageSchema),
    authentication, 
    US.coverImage)


userRouter.delete("/deleteProfileImage/:userId", validation(UV.deleteImageSchema), authentication, US.deleteProfileImage)
userRouter.delete("/deleteCoverImage/:userId", validation(UV.deleteImageSchema), authentication, US.deleteCoverImage)
userRouter.delete("/freezeAccount", validation(UV.freezeAccountSchema), authentication, US.freezeAccount)



userRouter.patch("/banUser/:userId", validation(UV.banUserSchema), authentication, US.banUser)
userRouter.patch("/banCompany/:companyId", validation(UV.banCompanySchema), authentication, US.banCompany)
userRouter.patch("/approveCompany/:companyId", validation(UV.approveCompanySchema), authentication, US.approveCompany)


export default userRouter