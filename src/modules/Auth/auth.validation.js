import joi from "joi"
import { generalRules } from "../../utils/index.js"
import { roleTypes } from "../../DB/enums.js"



export const signUpSchema =  {
    body : joi.object({
        firstName : joi.string().alphanum().min(3).max(30).required().messages({
            "string.min": "The first name is short",
            "string.max": "The first name is long",
        }),
        lastName : joi.string().alphanum().min(3).max(30).required().messages({
            "string.min": "The last name is short",
            "string.max": "The last name is long",
        }),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        cPassword: generalRules.password.valid(joi.ref("password")).required(),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/).required(),
        role: joi.string().valid(roleTypes.user, roleTypes.admin, roleTypes.superAdmin),
        DOB : joi.date()
    }).required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const confirmEmailSchema = {
    body : joi.object({
        email: generalRules.email.required(),
        code: joi.string().length(4).required() 
    }).required()    
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const logInSchema = {
    body : joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
    }).required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const refreshTokenSchema = {
    body : joi.object({
        authorization: joi.string().required()
        }).required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const forgetPasswordSchema = {
    body : joi.object({
        email: generalRules.email.required()
        }).required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const resetPasswordSchema = {
    body : joi.object({
        email: generalRules.email.required(),
        code: joi.string().length(4).required(),
        newPassword: generalRules.password.required(),
        cPassword: generalRules.password.valid(joi.ref("newPassword")).required()
        }).required()
}