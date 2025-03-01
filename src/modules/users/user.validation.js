import joi from "joi"
import { generalRules } from "../../utils/index.js"
import { enumsActionCompany, enumsActionUser, genderTypes } from "../../DB/enums.js"




export const updateProfileSchema = {
    body: joi.object({
        firstName: joi.string().alphanum().min(3).max(30),
        lastName: joi.string().alphanum().min(3).max(30),
        gender: joi.string().valid(genderTypes.male, genderTypes.female),
        phone: joi.string().regex(/^01[0125][0-9]{8}$/),
        DOB : joi.date()
    }).required(),
    headers : generalRules.headers.required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const updatePasswordSchema = {
    body: joi.object({
        oldPassword : generalRules.password.required(),
        newPassword : generalRules.password.required(),
        cPassword : generalRules.password.valid(joi.ref("newPassword")).required()
    }).required(),
    headers : generalRules.headers.required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const imageSchema = {
    file : generalRules.file.required(),
    headers : generalRules.headers.required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const deleteImageSchema = {
    params: joi.object({
        userId : generalRules.ObjectId.required()
    }).required(),
    headers : generalRules.headers.required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const freezeAccountSchema = {
    headers : generalRules.headers.required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const banUserSchema = {
    body: joi.object({
        action : joi.string().valid(enumsActionUser.banUser, enumsActionUser.unBannedUser).required()
    }).required(),
    params: joi.object({
        userId : generalRules.ObjectId.required()
    }).required(),
    headers : generalRules.headers
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const banCompanySchema = {
    body: joi.object({
        action : joi.string().valid(enumsActionCompany.banCompany, enumsActionCompany.unBannedCompany).required()
    }).required(),
    params: joi.object({
        companyId : generalRules.ObjectId.required()
    }).required(),
    headers : generalRules.headers
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const approveCompanySchema = {
    params: joi.object({
        companyId : generalRules.ObjectId.required()
    }).required(),
    headers : generalRules.headers
}