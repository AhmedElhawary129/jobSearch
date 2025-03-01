import * as dbService from "../../DB/dbService.js";

import { companyModel, jobModel } from "../../DB/models/index.js";

import { pagination } from "../../utils/features/index.js";
import { AppError, asyncHandler } from "../../utils/index.js";



// Jobs APIs =====>

// Add Job  ======>
export const addJob = asyncHandler(async (req, res, next) => {
    const {companyId} = req.params;
    const {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, userId} = req.body;

    const company = await dbService.findOne({model : companyModel, filter : {_id : companyId, createdBy : userId, isDeleted : false}})
    if (!company) {
        return next(new AppError("Company Not Found Or Deleted", 404))
    }

    if (company.createdBy != userId && !company?.Hrs?.includes(userId.toString())){
        return next(new AppError("You Have No Permision To Create The Job", 409))
    }

    const job = await dbService.create({model : jobModel, query : {
        jobTitle, 
        jobLocation, 
        workingTime, 
        seniorityLevel, 
        jobDescription, 
        technicalSkills, 
        softSkills,
        addedBy : userId,
        companyId
    }
})
    return res.status(201).json({ MSG: "DONE", job});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Update Job =====>
export const updateJob = asyncHandler(async (req, res, next) => {
    const {jobId} = req.params;
    const {jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, userId} = req.body;
        
    const job = await dbService.findOne({model : jobModel , filter : {_id : jobId, closed : false}})
    if (!job) {
        return next(new AppError("Job Not Found Or May Be Closed", 404))
    }
    console.log(job.addedBy);
    
    if (job.addedBy != userId) {
        return next(new AppError("You Have No Permision To Upadate The Job", 409))
    }
    const updatedJob = await dbService.findByIdAndUpdate({
        model : jobModel, 
        filter : {_id : jobId}, 
        update : {
            jobTitle, 
            jobLocation, 
            workingTime, 
            seniorityLevel, 
            jobDescription, 
            technicalSkills, 
            softSkills,
            updatedBy : userId
        }, 
        options : {new : true}
    })
    return res.status(201).json({ MSG: "DONE",  job :updatedJob});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Delete Job =====>
export const closeJob = asyncHandler(async (req, res, next) => {
    const {jobId, companyId} = req.params;
    const {userId} = req.body;
    const company = await dbService.findOne({
        model : companyModel,
        filter : {_id : companyId}
    })
    const job = await dbService.findOne({
        model : jobModel,
        filter : {
            _id : jobId, 
            closed : false,
            companyId,
        }
})
    if (!job && !company?.Hrs?.includes(userId.toString())) {
        return next(new AppError("Invalid Job Or You don't have permission", 403))
    }

    const deletedJob = await dbService.findByIdAndUpdate({
        model : jobModel, 
        filter :{_id : jobId}, 
        update :{
            closed : true,
            updatedBy : userId
        }, 
        options : {new : true}
    })
    return res.status(201).json({ MSG: "DONE", job : deletedJob});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Get all Jobs or a specific one for a specific company =====>
export const getJobs = asyncHandler(async (req, res, next) => {
    const {jobId, companyId} = req.params;
    const {companyName} = req.body;

    const job = await dbService.findOne({
        model : jobModel,
        filter : {
            _id : jobId, 
            closed : false,
            companyId
        }
})
if (!job) {
    return next(new AppError("No Jobs Found", 403))
}


const company = await dbService.findOne({
    model : companyModel,
    filter : {_id : companyId, companyName},
    select : ("companyName -_id")
})
if (!company) {
    return next(new AppError("Company Not Found", 403))
}

const {data, _page} = await pagination({model : companyModel, page : req.query.page, populate : [{path :"companyId"}]})
    return res.status(201).json({ MSG: "DONE", data:  {data, _page}, company});
});