import mongoose from "mongoose";
import { enumsSender } from "../enums.js";



const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    senderId: { type: String, required: true }
});

const chatSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
        enum: Object.values(enumsSender)
    },
    receiverId: { 
        type: String, 
        required: true 
    },
    messages: [
        messageSchema
    ]
}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true},
    timestamps : {
        createdAt : true,
        updatedAt : true
    }
});

export const chat = mongoose.model.Chat || mongoose.model("Chat", chatSchema)