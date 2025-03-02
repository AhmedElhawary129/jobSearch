import * as dbService from "../../DB/dbService.js";
import { providerTypes, roleTypes, tokenTypes } from "../../DB/enums.js";
import { userModel} from "../../DB/models/index.js";
import { decodedToken } from "../../middleware/auth.js";
import { asyncHandler, Hash, compare, generateToken, AppError, eventEmitter} from "../../utils/index.js";



// Auth APIs =====>

// signUp ======>
export const signUp = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, DOB, phone, gender, role } = req.body;

    // chick email exist or not
    if (await dbService.findOne({model : userModel, filter : { email }})) {
    return next(new AppError("Email already exist", 409));
    }

    // send otp message
    eventEmitter.emit("EmailConfirmation", {email})

    // create the user
    async function ctreate() {
        const user = await new userModel({
            firstName,
            lastName,
            email,
            gender,
            DOB,
            role,
            password,
            phone
        })
        await user.save()
    }
    ctreate()
    return res.status(201).json({ MSG: "Account Created"});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// Confirm Email =====>
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { email, code } = req.body;

    // chick email exist or not
    const user = await dbService.findOne({
        model : userModel, 
        filter : { email, isConfirmed : false, isDeleted : false }
    });
    if (!user) {
        return next(new AppError("Email not exist or already confirmed", 404));
        }

    // compare code
    if (!await compare({key : code, hashed : user.otpEmail})) {
    return next(new AppError("Invalid code", 400));
    }

    // update user
    await dbService.updateOne({
        model : userModel, 
        filter : {email}, 
        update : {isConfirmed : true, $unset : {otpEmail : 0}}
    })
    return res.status(201).json({ MSG: "DONE"});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// logIn =====>
export const logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await dbService.findOne({
        model : userModel, 
        filter : { email, isConfirmed: true, provider: providerTypes.system }
    });
    if (!user) {
        return next(
        new AppError("Email not exists or not confirmed yet", 400 )
    );
    }
    if (!await compare({key: password, hashed: user.password })) {
        return next(new AppError("Invalid Password", 400 ));
    }
    // generate token
    const access_token = await generateToken({
        payload: { email, id: user._id },
        SIGNATURE:
        user.role == roleTypes.user
            ? process.env.ACCESS_SIGNATURE_USER
            : process.env.ACCESS_SIGNATURE_ADMIN,
        option: { expiresIn: "1h" },
    });
    const refresh_token = await generateToken({
        payload: { email, id: user._id },
        SIGNATURE:
        user.role == roleTypes.user
            ? process.env.REFRESH_SIGNATURE_USER
            : process.env.REFRESH_SIGNATURE_ADMIN,
        option: { expiresIn: "7d" },
    });
    return res.status(201).json({ MSG: "DONE", token : {
        access_token,
        refresh_token
    }});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// signup with google =====>
export const signUpWithGmail = asyncHandler(async (req, res, next) => {
    const {idToken} = req.body;
    const client = new OAuth2Client();
    async function verify() {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    return payload;
    }
    const {email, email_verified, picture, name} = await verify();
    let user = await dbService.findOne({model : userModel, filter : {email}})
    if (!user) {
        user = await dbService.create({model : userModel, query :{
            name,
            email,
            isConfirmed: email_verified,
            profileImage: picture,
            provider: providerTypes.google
        }})
    }
    return res.status(201).json({ MSG: "SignUp with google done", user});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// login with google =====>
export const logInWithGmail = asyncHandler(async (req, res, next) => {
    const {idToken} = req.body;
    const client = new OAuth2Client();
    async function verify() {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    return payload;
    }
    const {email, email_verified, picture, name} = await verify();
    let user = await dbService.findOne({model : userModel, filter : {email}})
    if (!user) {
        return next(new AppError("User not found"), 402)
    }
    if (user.provider != providerTypes.google) {
        return next(new AppError("Please login with in system"), 400)
}
    // generate token
    const access_token = await generateToken({
        payload: { email, id: user._id },
        SIGNATURE:
        user.role == roleTypes.user
            ? process.env.SIGNATURE_TOKEN_USER
            : process.env.SIGNATURE_TOKEN_ADMIN,
        option: { expiresIn: "1d" },
    });
    return res.status(201).json({ MSG: "DONE", token : access_token});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// forget password =====>
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!await dbService.findOne({model : userModel, filter : { email, isDeleted: false }})) {
        return next(
        new AppError("Email not exists", 404 )
    );
    }
eventEmitter.emit("forgetPassword", {email});
    return res.status(201).json({ MSG: "DONE"});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// reset password =====>
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, code, newPassword } = req.body;
    const user = await dbService.findOne({
        model : userModel, 
        filter : { email, isDeleted: false }
    })
    if (!user) {
        return next(
        new AppError("Email not exists",  404)
    );
    }
    // compare code
    if (!await compare({key : code, hashed : user.otpPassword})) {
        return next(new AppError("Invalid code", 400 ));
        }
    // hashing password
    const hash = await Hash({ key : newPassword, SALT_ROUNDS: +process.env.SALT_ROUNDS });

    // update user
    await dbService.updateOne({
        model : userModel, 
        filter : {email}, 
        update : {password : hash, confirmed : true, $unset : {otpPassword : 0}}})
        return res.status(201).json({ MSG: "DONE"});
});

//------------------------------------------------------------------------------------------------------------------------------------------

// refresh token =====>
export const refreshToken = asyncHandler(async (req, res, next) => {
    const {authorization} = req.body;

    const user = await decodedToken({authorization, tokenType : tokenTypes.refresh, next})

    // generate token
    const access_token = await generateToken({
        payload: { email : user.email, id: user._id },
        SIGNATURE:
        user.role == roleTypes.user
            ? process.env.ACCESS_SIGNATURE_USER
            : process.env.ACCESS_SIGNATURE_ADMIN,
        option: { expiresIn: "1d" },
    });
    return res.status(201).json({ MSG: "DONE", token : {
        access_token
    }});
});