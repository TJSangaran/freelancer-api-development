module.exports = {
    MongoURI: process.env.DB_CONNECT,
    emailConfig: {
        email_address: process.env.EMAIL_ADDRESS,
        email_client_id: process.env.EMAIL_CLIENT_ID,
        email_client_secret: process.env.EMAIL_CLIENT_SECRET,
        email_redirect_uri: process.env.EMAIL_REDIRECT_URI,
        email_referesh_token: process.env.EMAIL_REFERESH_TOKEN
    },
    FROENTEND_DOMAIN : process.env.FROENTEND_DOMAIN,
    PASSWORD_RESET_PATH: process.env.PASSWORD_RESET_PATH,
    streamConfig: {
        api_key: process.env.STREAM_API_KEY,
        api_secret: process.env.STREAM_API_SECRET
    }
}