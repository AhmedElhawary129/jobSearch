import { Router } from "express";
import * as CS from "./company.service.js";
import { authentication } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as CV from "./company.validation.js";
import { multerMost } from "../../middleware/multer.js";
import { fileTypes } from "../../DB/enums.js";
import jobRouter from "../jobs/job.controller.js";

const companyRouter = Router({mergeParams : true})

companyRouter.use("/:companyId/jobs", jobRouter)

companyRouter.post("/addCompany", 
    multerMost([...fileTypes.image, ...fileTypes.pdf]).single("attachment"), 
    authentication,
    validation(CV.addCompanySchema), 
    CS.addCompany)


companyRouter.patch("/updateData/:companyId", 
    authentication,
    CS.updateCompanyData)


companyRouter.delete("/freezeCompany/:companyId", 
    authentication,
    validation(CV.freezeCompanySchema), 
    CS.freezeCompany)


companyRouter.get("/getCompany/:companyId", authentication, CS.getCompany)


companyRouter.get("/getByName", 
    validation(CV.getCompanySchema), 
    CS.getCompanyByName)


companyRouter.patch("/companyLogo", 
    multerMost(fileTypes.image).single("attachment"), 
    validation(CV.logoSchema),
    authentication,
    CS.companyLogo)


companyRouter.patch("/coverImage", 
    multerMost(fileTypes.image).single("attachment"), 
    validation(CV.coverImageSchema),
    authentication,
    CS.coverImage)


companyRouter.delete("/deleteCompanyLogo/:companyId",
    validation(CV.deleteLogoSchema),
    authentication,
    CS.deleteCompanyLogo)


companyRouter.delete("/deleteCompanyCover/:companyId",
    validation(CV.deleteCoverSchema),
    authentication,
    CS.deleteCompanyCover)



export default companyRouter