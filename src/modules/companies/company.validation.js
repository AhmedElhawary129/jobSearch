import joi from "joi"
import { generalRules } from "../../utils/index.js"



export const addCompanySchema =  {
    body : joi.object({
        companyName: joi.string().min(3).required(),
        description: joi.string().min(8).required(),
        industry: joi.string().required(),
        address: joi.string().required(),
        companyEmail: joi.string().email().required(),
        NumberOfEmployees: joi.number().min(11).max(20).required()
    }).required(),
    file : generalRules.file,
    headers : generalRules.headers.required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const updateCompanyDataSchema =  {
    body : joi.object({
        companyName: joi.string().min(3),
        description: joi.string().min(8),
        industry: joi.string(),
        address: joi.string(),
        companyEmail: joi.string().email(),
        NumberOfEmployees: joi.number().min(11).max(20)
    }).required(),
    params : joi.object({
        companyId: generalRules.ObjectId.required()
    }).required(),
    headers : generalRules.headers.required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const freezeCompanySchema =  {
    params : joi.object({
        companyId: generalRules.ObjectId.required()
    }).required(),
    headers : generalRules.headers.required()
}
//------------------------------------------------------------------------------------------------------------------------------------------

export const getCompanySchema =  {
    body : joi.object({
        companyName: joi.string().min(3).required()
    }).required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const logoSchema = {
    file : generalRules.file,
    headers : generalRules.headers.required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const coverImageSchema = {
    file : generalRules.file,
    headers : generalRules.headers.required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const deleteLogoSchema = {
    params : joi.object({
        companyId: generalRules.ObjectId.required()
    }).required(),
    headers : generalRules.headers.required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const deleteCoverSchema = {
    params : joi.object({
        companyId: generalRules.ObjectId.required()
    }).required(),
    headers : generalRules.headers.required()
}

