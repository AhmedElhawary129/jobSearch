export class AppError extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode;
        this.message = message;
    }
}


export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            return next(error)
        })
    }
}


export const globalErrorHandling = (error, req, res, next) => {
    if (process.env.MODE=="DEV") {
        return res.status(error.statusCode || 500).json({
            message : error.message,
            stack : error.stack
        })
    }
    return res.status(error.statusCode || 500).json({
        message : error.message
    })
};