import mongoose from "mongoose";
import { enumStatus } from "../enums.js";




const applicationSchema = new mongoose.Schema({
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'JobOpportunity', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    userCV: {
        secure_url: { 
            type: String, 
            required: true 
        },
        public_id: { 
            type: String, 
            required: true 
        }
    },
    status: {
        type: String,
        enum: Object.values(enumStatus),
        default: enumStatus.pending
    }
},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true},
    timestamps : {
        createdAt : true,
        updatedAt : true
    }
})


export const applicationModel = mongoose.model.Application || mongoose.model("Application", applicationSchema)