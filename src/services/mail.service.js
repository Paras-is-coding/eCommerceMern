require('dotenv').config();
const nodemailer = require("nodemailer")

class MailService {
    transport;
    constructor() {
        try{
            this.transport = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            })
        } catch(except) {
            throw except
        }
    }
    async emailSend(to, sub, message) {
        try {
            await this.transport.sendMail({
                to: to, 
                from: process.env.SMTP_FROM,
                subject: sub,
                html: message
            })
            return true;
        } catch(except) {
            throw except
        }
    }

    }

const mailSvc = new MailService()
module.exports = mailSvc;