import * as dbService from "../../DB/dbService.js";
import { companyModel } from "../../DB/models/index.js";
import cloudinary from "../../utils/cloudinary/index.js";
import { AppError, asyncHandler } from "../../utils/index.js";
import { roleTypes } from "../../DB/enums.js";


// Company APIs =====>

// Add company ======>
export const addCompany = asyncHandler(async (req, res, next) => {
    const {companyName, description, industry, address, NumberOfEmployees, companyEmail} = req.body;

    // chick name exist or not
    if (await dbService.findOne({model : companyModel, filter : { companyName }})) {
        return next(new AppError("This name already exist", 409));
    }

    // chick email exist or not
    if (await dbService.findOne({model : companyModel, filter : { companyEmail }})) {
        return next(new AppError("This email already exist", 409));
    }

    if (!req?.file) {
        return next(new AppError("Please Upload legal attachment", 400))
    }
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder : "Exam/companies/attachment"
    })

    const company = await dbService.create({
        model : companyModel, 
        query : {
            companyName, 
            description, 
            industry, 
            address, 
            NumberOfEmployees, 
            companyEmail,  
            createdBy  : req.user._id,
            Hrs : [req.user._id],
            legalAttachment : {secure_url, public_id}
        }
    })
    return res.status(201).json({ MSG: "Company Added Successfully", company});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Update company data =====>
export const updateCompanyData = asyncHandler(async (req, res, next) => {
    const {companyId} = req.params;
    const {companyName, description, industry, address, NumberOfEmployees, companyEmail} = req.body;

    if (!await dbService.findOne({
        model : companyModel, 
        filter : {
            _id : companyId, 
            createdBy : req.user._id, 
            isDeleted : {$exists : false}
        }
    })
) {
        return next(new AppError("Company May Be Deleted Or Un Authorized"), 400)
    }
    const company = await dbService.findByIdAndUpdate({
        model : companyModel, 
        filter : {createdBy : req.user._id}, 
        update : {companyName, description, industry, address, NumberOfEmployees, companyEmail}, 
        options : {new : true}
    })
    return res.status(201).json({ MSG: "Company Data Updated Successfully", company});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Soft delete company =====>
export const freezeCompany = asyncHandler(async (req, res, next) => {
    const {companyId} = req.params;

    const company = await dbService.findOne({
        model : companyModel, 
        filter : {_id : companyId, isDeleted : false}
    })
    
    if (!company || (
        req.user.role != roleTypes.admin
        && 
        req.user._id.toString() != company.createdBy.toString()
    )) {
        return next(new AppError("Invalid comment You don't have permission", 403))
    }
    const deletedCompany = await dbService.findByIdAndUpdate({
        model : companyModel, 
        filter : {_id : companyId}, 
        update : {isDeleted : true, deletedBy : req.user._id}, 
        options : {new : true}
    })
        return res.status(201).json({ MSG: "Company Freezed Successfully", deletedCompany });
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Get specific company with related jobs =====>
export const getCompany = asyncHandler(async (req, res, next) => {
    const {companyId} = req.params;
    const company = await dbService.findOne({model : companyModel, filter : {_id : companyId, isDeleted : false}, populate : [{
        path : "jobId",
        select : "jobTitle  -_id"
    }], select : "companyName description industry address NumberOfEmployees companyEmail"})


    return res.status(201).json({ MSG: "DONE",  company});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Search for a company with a name =====>
export const getCompanyByName = asyncHandler(async (req, res, next) => {
    const {companyName} = req.body
    const company = await dbService.findOne({
        model : companyModel, 
        filter : {companyName, isDeleted : false},
        select : ("companyName description industry address NumberOfEmployees companyEmail -_id")
    })
    if (!company) {
        return next(new AppError("Company May Be Deleted"), 400)
    }
    return res.status(201).json({ MSG: "DONE", company});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Upload company logo =====>
export const companyLogo = asyncHandler(async (req, res, next) => {
    const company = await dbService.findOne({model : companyModel, filter : {createdBy : req.user._id, isDeleted : false}})
    if (!company) {
        return next (new AppError("Company May Be Deleted Or Un Authorized", 400))
    }
    if (!req?.file) {
    return next(new AppError("Please Upload Logo", 400))
    }

    if (company.logo.public_id) {
        await cloudinary.uploader.destroy(company.logo.public_id)
    }
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder : "Exam/companies/companyLogo",
    })
    // update the company
    const updatedCompany = await dbService.findByIdAndUpdate({
        model : companyModel, 
        filter : {createdBy : req.user._id}, 
        update : {logo : {secure_url, public_id}}
    })
    return res.status(201).json({ MSG: "Company logo Uploaded Successfully", updatedCompany});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Upload company Cover Pic =====>
export const coverImage = asyncHandler(async (req, res, next) => {
    const company = await dbService.findOne({model : companyModel, filter : {createdBy : req.user._id, isDeleted : false}})
    if (!company) {
        return next (new AppError("Company May Be Deleted Or Un Authorized", 400))
    }
    if (!req?.file) {
        return next(new AppError("Please Upload cover image", 400))
    }
    if (company.coverImage.public_id) {
        await cloudinary.uploader.destroy(company.coverImage.public_id)
    }
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {
        folder : "Exam/companies/coverImage",
    })
    // update the company
    const updatedCompany = await dbService.findByIdAndUpdate({
        model : companyModel, 
        filter : {createdBy : req.user._id}, 
        update : {coverImage : {secure_url, public_id}}
    })
    return res.status(201).json({ MSG: "Cover Picture Uploaded Successfully", updatedCompany});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Delete company logo =====>
export const deleteCompanyLogo = asyncHandler(async (req, res, next) => {
    const {companyId} = req.params;

    const company = await dbService.findOne({
        model : companyModel, 
        filter : {createdBy : req.user._id, 
            isDeleted : false}
        })

    if (!company) {
        return next (new AppError("Company May Be Deleted Or Un Authorized", 400))
    }

    if (companyId != company._id) {
        return next (new AppError("Company Not Found", 400))
    }
    await cloudinary.uploader.destroy(company.logo.public_id)
    return res.status(201).json({ MSG: "Company Logo Deleted Successfully"});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Delete company Cover Pic =====>
export const deleteCompanyCover = asyncHandler(async (req, res, next) => {
    const {companyId} = req.params;

    const company = await dbService.findOne({
        model : companyModel, 
        filter : {createdBy : req.user._id, 
            isDeleted : false}
        })

    if (!company) {
        return next (new AppError("Company May Be Deleted Or Un Authorized", 400))
    }

    if (companyId != company._id) {
        return next (new AppError("Company Not Found", 400))
    }
    await cloudinary.uploader.destroy(company.coverImage.public_id)
    return res.status(201).json({ MSG: "Company Cover Image Deleted Successfully"});
});