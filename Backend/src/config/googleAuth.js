const { google } = require('googleapis')

const SCOPES = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    "https://www.googleapis.com/auth/documents.readonly"
]

function createOauthClient(){
    return new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    )
}

function getAuthUrl(){
    const oauth2Client = createOauthClient()
    const url = oauth2Client.generateAuthUrl({
        access_type : 'offline',
        scope : SCOPES,
        prompt : 'consent'
    })

    return url
}

module.exports = { getAuthUrl, createOauthClient }