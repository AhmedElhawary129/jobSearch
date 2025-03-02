import mongoose from "mongoose";
import { enumLocation, enumSeniorityLevel, enumWorkingTime } from "../enums.js";


const jobOpportunitySchema = new mongoose.Schema({

    jobTitle: { 
        type: String, 
        required: true 
    },
    jobLocation: { 
        type: String, 
        enum: Object.values(enumLocation), 
        required: true 
    },
    workingTime: { 
        type: String, 
        enum: Object.values(enumWorkingTime), 
        required: true 
    },
    seniorityLevel: { 
        type: String, 
        enum: Object.values(enumSeniorityLevel), 
        required: true 
    },
    jobDescription: { 
        type: String, 
        required: true 
    },
    technicalSkills: { 
        type: [String], 
        required: true 
    },
    softSkills: { 
        type: [String], 
        required: true 
    },
    addedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    updatedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    closed: { 
        type: Boolean, 
        default: false 
    },
    companyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Company"
    },
    CV : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Application"
    }
},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true},
    timestamps : {
        createdAt : true,
        updatedAt : true
    }
})


export const jobModel = mongoose.model.JobOpportunity || mongoose.model("JobOpportunity", jobOpportunitySchema)