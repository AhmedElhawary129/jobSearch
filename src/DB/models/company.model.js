import mongoose from "mongoose";


const companySchema = new mongoose.Schema({
    companyName : {
        type : String,
        unique : true,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    industry : {
        type : String,
        required : true,
    },
    address : {
        type : String,
        required : true
    },
    NumberOfEmployees : {
        type : Number,
        required : true,
        min : 11,
        max : 20,
        message: "numberOfEmployees must be in range format such as 11-20"
    },
    companyEmail : {
        type : String,
        required : true,
        unique : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    },
    jobId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "JobOpportunity",
    },
    logo : {
        secure_url : String,
        public_id : String
    },
    coverImage : {
        secure_url : String,
        public_id : String
    },
    HRs : [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    bannedAt: Date,
    deletedAt: Date,
    legalAttachment : {
        secure_url : String,
        public_id : String
    },
    approvedByAdmin: { 
        type: Boolean, 
        default: false 
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    deletedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true},
    timestamps : {
        createdAt : true,
        updatedAt : true
    }
})

export const companyModel = mongoose.model.Company || mongoose.model("Company", companySchema)