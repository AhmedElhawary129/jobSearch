import multer from "multer";
import { nanoid } from "nanoid/non-secure";
import fs from "fs"



export const multerLocal = (customValidation = [], customPath = "generals") => {
    const fullPath = `uploads/${customPath}`
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, {recursive : true})
    }
    const storage = multer.diskStorage({
        destination : (req, file, cb) =>{
            cb(null, fullPath)
        },
        filename: (req, file, cb) => {
            cb(null, nanoid(4) + file.originalname)
        }
    })
    function fileFilter (req, file, cb) {

        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        }else {
            cb(new Error("Invalid File Format", false))
        }
}
    const  upload = multer({storage, fileFilter})
    return upload
}

//------------------------------------------------------------------------------------------------------------------------------------------

export const multerMost = (customValidation = []) => {
    const storage = multer.diskStorage({})
    
    function fileFilter (req, file, cb) {

        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        }else {
            cb(new Error("Invalid File Format", false))
        }
}
    const  upload = multer({storage, fileFilter})
    return upload
}