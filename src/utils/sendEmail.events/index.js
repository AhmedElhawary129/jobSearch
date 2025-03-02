import { EventEmitter } from "events";
import { sendEmail } from "../../service/sendEmails.js";
import { customAlphabet } from 'nanoid'
import { userModel } from "../../DB/models/index.js";
import { Hash } from "../encryption/index.js";
import { html } from "../../service/template-email.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on("EmailConfirmation", async (data) => {
  const { email, id } = data;

  // generate otp
  const otp = customAlphabet("0123456789", 4)();

  const hash = await Hash({ key : otp, SALT_ROUNDS : process.env.SALT_ROUNDS})
  await userModel.updateOne({email, _id : id}, {otpEmail : hash})
  await sendEmail({to:email , subject:"Confirm Email",html:html({otp, message: "Confirm Email"})});
});



eventEmitter.on("newEmailConfirmation", async (data) => {
  const { email, id } = data;

  // generate otp
  const otp = customAlphabet("0123456789", 4)();

  const hash = await Hash({ key : otp, SALT_ROUNDS : process.env.SALT_ROUNDS})
  await userModel.updateOne({tempEmail : email, _id : id}, {otpNewEmail : hash})
  await sendEmail({to:email , subject:"Confirm Email",html:html({otp, message: "Confirm New Email"})});
});



eventEmitter.on("forgetPassword", async (data) => {
  const { email } = data;

  // generate otp
  const otp = customAlphabet("0123456789", 4)();

  const hash = await Hash({ key : otp, SALT_ROUNDS : process.env.SALT_ROUNDS})
  await userModel.updateOne({email}, {otpPassword : hash})
  await sendEmail({to:email , subject:"Confirm Email",html:html({otp, message: "Forget Password"})});
});