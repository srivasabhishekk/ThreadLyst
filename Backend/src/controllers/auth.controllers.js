const { getAuthUrl, createOauthClient } = require("../config/googleAuth")
const { encryptToken, decryptToken } = require('../utils/crypto.utils')
const User = require('../models/user.model')
const blacklistToken = require('../models/blacklistToken.model')
const jwt = require('jsonwebtoken')

const signIn = (req, res) => {
    try{
        const url = getAuthUrl()

        return res.status(200).json({ url })
    }catch(err){
        console.log(err)

        return res.status(500).json({ message : "Unable to generate sign-in URL." })
    }
}

const initAuthorization = async (req, res) => {
    try {
        if (req.query.error) {
            return res.status(401).json({
                message: "Authentication failed, access denied."
            });
        }

        const { code } = req.query;

        if (!code) {
            return res.status(400).json({
                message: "Authentication code missing."
            });
        }

        const oauth2Client = createOauthClient();

        const { tokens } = await oauth2Client.getToken(code);

        if (!tokens || !tokens.id_token) {
            return res.status(401).json({
                message: "Error fetching tokens!"
            });
        }

        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.CLIENT_ID
        });

        const payload = ticket.getPayload();

        const googleUserId = payload.sub;
        const email = payload.email;

        const encryptedRefreshToken = tokens.refresh_token
            ? encryptToken(tokens.refresh_token)
            : null;

        const encryptedAccessToken = tokens.access_token
            ? encryptToken(tokens.access_token)
            : null;

        let user = await User.findOne({
            googleId: googleUserId
        });

        if (user) {
            user.refreshToken = encryptedRefreshToken;
            user.accessToken = encryptedAccessToken;
            user.expiryTime = tokens.expiry_date;

            await user.save();

            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    googleId: user.googleId
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );

            return res.status(200).json({
                message: "Welcome back! Authentication successful, user logged in successfully.",
                token,
                email: user.email
            });
        }

        user = await User.create({
            googleId: googleUserId,
            email,
            accessToken: encryptedAccessToken,
            refreshToken: encryptedRefreshToken,
            expiryTime: tokens.expiry_date
        });

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                googleId: user.googleId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(201).json({
            message: "Authentication successful, user successfully registered.",
            token,
            email: user.email
        });

    } catch (err) {
        console.error("Google authorization error:", err);

        return res.status(500).json({
            message: "Internal server error! Please try again later."
        });
    }
};

const logout = async (req, res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if(authHeader && authHeader.startsWith("Bearer ")){
        const token = authHeader.split(" ")[1]

        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            if(decoded){
                await blacklistToken.create({ token })

                return res.status(200).json({
                    message :"Logged out successfully."
                })
            }
        }catch(err){
             return res.status(400).json({
                message :  "Invalid Token!"
            })
        }
    }

    return res.status(400).json({
        message : "Token missing or invalid!"
    })
}

module.exports = { signIn, initAuthorization, logout }