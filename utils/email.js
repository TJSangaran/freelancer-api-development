const nodemailer = require('nodemailer')
const {google} = require('googleapis')
const config = require('../config/keys')
const emailConfig = config.emailConfig

async function sendMail({to ,subject,title, text,html,attachments=[]}, callback ){
    try{
        const oAuth2Client = new google.auth.OAuth2(emailConfig.email_client_id, emailConfig.email_client_secret,emailConfig.email_redirect_uri)
        oAuth2Client.setCredentials({refresh_token: emailConfig.email_referesh_token})
        const accessToken= await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type:'OAuth2',
                user: emailConfig.email_address,
                clientId: emailConfig.email_client_id,
                clientSecret: emailConfig.email_client_secret,
                refreshToken: emailConfig.email_referesh_token,
                accessToken: accessToken
            }
        })

        const mailTitle = title || config.app_name
        const mailOptions = {
            from: mailTitle + " <"+ emailConfig.email_address+ ">",
            to: to,
            subject:subject,
            text: text,
            html: html,
            attachments:attachments
        }
        const result = await transport.sendMail(mailOptions)
        return callback(null, result)

    } catch (error){
        return callback( error)
    }
}

module.exports = sendMail;