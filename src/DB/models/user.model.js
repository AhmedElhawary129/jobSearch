import mongoose from "mongoose";
import { genderTypes, providerTypes, roleTypes } from "../enums.js";
import { Encrypt, Hash } from "../../utils/index.js";



const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, "firstName is required"],
        minLength : [3, "firstName is too short"],
        maxLength : 30,
        trim : true
    },
    lastName : {
        type : String,
        required : [true, "lastName is required"],
        minLength : [3, "lastName is too short"],
        maxLength : 30,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
        minLength : 8,
        trim : true
    },
    provider : {
        type : String,
        enum : Object.values(providerTypes),
        default : providerTypes.system
    },
    gender : {
        type : String,
        required : true,
        enum : Object.values(genderTypes),
        default :genderTypes.male
    },
    DOB : {
        type : Date,
        required: true
    },
    phone : {
        type : String,
        required : true,
        trim : true
    },
    role : {
        type : String,
        enum : Object.values(roleTypes),
        default : roleTypes.user
    },
    isConfirmed : {
        type : Boolean,
        default : false
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    deletedAt : Date,
    bannedAt : Date,
    updatedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    changeCredentialTime : {
        type : Date
    },
    profileImage : {
        secure_url : String,
        public_id : String
    },
    coverImage : {
        secure_url : String,
        public_id : String
    },
    changePasswordAt : Date,
    otpEmail : String,
    tempEmail : String,
    otpNewEmail: String,
    otpPassword : String,

},{
    virtuals : {
        username :{
            get() { return `${this.firstName} ${this.lastName}`; },
            set(v) {
                const firstName = v.substring(0, v.indexOf(' '));
                const lastName = v.substring(v.indexOf(' ') + 1);
                this.set({ firstName, lastName });
            }
        }
    },
    toJSON : {virtuals : true},
    toObject : {virtuals : true},
    timestamps : {
        createdAt : true,
        updatedAt : true
    }
})

userSchema.pre( "save", async function(next, doc){
    if (this.isModified("password")) {
        this.password = await Hash({key : this.password, SALT_ROUNDS : process.env.SALT_ROUNDS})
    }
    if (this.isModified("phone")) {
        this.phone = await Encrypt({key : this.phone, SECRET_KEY : process.env.SECRET_KEY})
    }
    next()
})


export const userModel = mongoose.model.User || mongoose.model("User", userSchema)