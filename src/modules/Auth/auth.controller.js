import { Router } from "express";
import * as AS from "./auth.service.js";
import { validation } from "../../middleware/validation.js";
import * as AV from "./auth.validation.js";


const authRouter = Router()

authRouter.post("/signUp", 
    validation(AV.signUpSchema), 
    AS.signUp)

authRouter.patch("/confirmEmail", validation(AV.confirmEmailSchema), AS.confirmEmail)
authRouter.post("/logIn", validation(AV.logInSchema), AS.logIn)
authRouter.patch("/forgetPassword", validation(AV.forgetPasswordSchema), AS.forgetPassword)
authRouter.patch("/resetPassword", validation(AV.resetPasswordSchema), AS.resetPassword)
authRouter.get("/refreshToken", validation(AV.refreshTokenSchema), AS.refreshToken)

// authRouter.post("/loginWithGmail", US.loginWithGmail)

export default authRouter