import { Resend } from "resend";
import { RESEND_API_KEY, FROM_EMAIL } from "../config/config.js";

const resend = new Resend(RESEND_API_KEY);

export const sendMail = async ({ email, title, body }) => {
    const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: title,
        html: body
    });

    if (error) {
        return { success: false, message: error.message };
    }

    return { success: true, message: "Email is sent successfully" };
};
