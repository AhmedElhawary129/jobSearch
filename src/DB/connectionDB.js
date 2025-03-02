import mongoose from "mongoose";

export const connectionDB = async ()=> {
    await mongoose.connect(process.env.URI)
    .then(()=>{
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log("Error to connecting to database", err);
    })
}