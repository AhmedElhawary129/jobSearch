import cors from "cors";
import { connectionDB } from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import { AppError, globalErrorHandling } from "./utils/error/index.js";
import path from "path";
import { rateLimit } from "express-rate-limit";
import companyRouter from "./modules/companies/company.controller.js";
import jobRouter from "./modules/jobs/job.controller.js";
import authRouter from "./modules/Auth/auth.controller.js";

// limiter
const limiter = rateLimit({
    limit : 5,
    windowMs : 60 * 1000,
    message : {Error : "Try Again Later"},
    statusCode : 429,
    handler : (req, res, next) => {
        return next(new AppError("Try Again Later", 429))
    }
})


const bootstrap = async (app, express) => {

    // connect to database
    await connectionDB();


    // use cors middleware
    app.use(cors())


    // limiter
    app.use(limiter)


    // test()


    app.use("/uploads", express.static(path.resolve("src/uploads")))


    // use json middleware for parsing request data
    app.use(express.json());


    // home router
    app.get("/", (req, res, next) => {
        return res.status(200).json({MSG : "Hello on my social app"})
    })

    // application routers
    app.use("/auth", authRouter);
    app.use("/users", userRouter);
    app.use("/companies", companyRouter);
    app.use("/jobs", jobRouter);


    // unHandle routes
    app.use("*", (req, res, next) => {
        return next(new AppError(`invalid URL ${req.originalUrl}`, 404));
    });


    // error handling middleware
    app.use(globalErrorHandling);
};
export default bootstrap;
