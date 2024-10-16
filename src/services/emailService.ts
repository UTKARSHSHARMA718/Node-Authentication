import nodemailer from "nodemailer"
import logger from "../utils/logger"

const transporter = nodemailer.createTransport({
    //@ts-ignore
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
})

export const sendMail = async (
    emailToSend: string,
    subject: string,
    content: string
) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: emailToSend,
            subject,
            html: content,
        }

        await new Promise((res, rej) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    logger.error(error)
                    console.log({ error })
                    rej(error)
                    return
                }
                res(info)
                logger.info({ meta: info })
            })
        })
    } catch (err) {
        console.log({ err })
        logger.error("EMAIL_SERVICE", {
            meta: err,
        })
    }
}
