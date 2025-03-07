import { Router } from "express";
import * as JS from "./job.service.js";
import { authentication } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as JV from "./job.validation.js";


const jobRouter = Router({mergeParams : true})

jobRouter.post("/addJob/:companyId", 
    authentication,
    validation(JV.addJobSchema), 
    JS.addJob)

jobRouter.patch("/updateJob/:jobId", 
    authentication,
    validation(JV.updateJobSchema), 
    JS.updateJob)


jobRouter.delete("/closeJob/:jobId", 
    authentication,
    validation(JV.closeJobSchema), 
    JS.closeJob)


jobRouter.get("/getJobs/:jobId", 
    validation(JV.getJobsSchema), 
    JS.getJobs)


jobRouter.get("/filterJobs", 
    authentication,
    validation(JV.filterJobsSchema), 
    JS.filterJobs)


jobRouter.get("/getApps/:jobId", 
    authentication,
    validation(JV.getAppsSchema), 
    JS.getApps)




export default jobRouter