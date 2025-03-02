import joi from "joi"
import { generalRules } from "../../utils/index.js"
import { enumLocation, enumSeniorityLevel, enumWorkingTime } from "../../DB/enums.js"



export const addJobSchema =  {
    body : joi.object({
        jobTitle : joi.string().required(), 
        jobLocation : joi.string().valid(enumLocation.onsite, enumLocation.remotely, enumLocation.hybrid).required(), 
        workingTime : joi.string().valid(enumWorkingTime.fullTime, enumWorkingTime.partTime).required(), 
        seniorityLevel : joi.string().valid(
            enumSeniorityLevel.fresh, 
            enumSeniorityLevel.Junior, 
            enumSeniorityLevel.MidLevel,
            enumSeniorityLevel.Senior, 
            enumSeniorityLevel.TeamLead, 
            enumSeniorityLevel.CTO
        ).required(), 
        jobDescription : joi.string().required(), 
        technicalSkills : joi.array().required(), 
        softSkills : joi.array().required(),
        userId : generalRules.ObjectId.required()
    }).required(),
    params : joi.object({
        companyId : generalRules.ObjectId.required()
    }).required(),
    headers : generalRules.headers
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const updateJobSchema =  {
    body : joi.object({
        jobTitle : joi.string(), 
        jobLocation : joi.string().valid(enumLocation.onsite, enumLocation.remotely, enumLocation.hybrid), 
        workingTime : joi.string().valid(enumWorkingTime.fullTime, enumWorkingTime.partTime), 
        seniorityLevel : joi.string().valid(
            enumSeniorityLevel.fresh, 
            enumSeniorityLevel.Junior, 
            enumSeniorityLevel.MidLevel,
            enumSeniorityLevel.Senior, 
            enumSeniorityLevel.TeamLead, 
            enumSeniorityLevel.CTO
        ), 
        jobDescription : joi.string(), 
        technicalSkills : joi.array(), 
        softSkills : joi.array(),
        userId : generalRules.ObjectId.required()
    }).required(),
    params : joi.object({
        jobId : generalRules.ObjectId.required()
    }).required(),
    headers : generalRules.headers
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const closeJobSchema =  {
    body : joi.object({
        userId : generalRules.ObjectId.required()
    }).required(),
    params : joi.object({
        jobId : generalRules.ObjectId.required(),
        companyId : generalRules.ObjectId.required()
    }).required(),
    headers : generalRules.headers
}
//------------------------------------------------------------------------------------------------------------------------------------------

export const getJobsSchema =  {
    params : joi.object({
        jobId : generalRules.ObjectId.required(),
        companyId : generalRules.ObjectId.required()
    }).required()
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const filterJobsSchema =  {
    body : joi.object({
        jobTitle : joi.string(), 
        jobLocation : joi.string().valid(enumLocation.onsite, enumLocation.remotely, enumLocation.hybrid), 
        workingTime : joi.string().valid(enumWorkingTime.fullTime, enumWorkingTime.partTime), 
        seniorityLevel : joi.string().valid(
            enumSeniorityLevel.fresh, 
            enumSeniorityLevel.Junior, 
            enumSeniorityLevel.MidLevel,
            enumSeniorityLevel.Senior, 
            enumSeniorityLevel.TeamLead, 
            enumSeniorityLevel.CTO
        ), 
        technicalSkills : joi.array(), 
    }).required(),
    headers : generalRules.headers
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const getAppsSchema =  {
    params : joi.object({
        jobId : generalRules.ObjectId.required(), 
        companyId : generalRules.ObjectId.required() 
    }).required(),
    headers : generalRules.headers
}