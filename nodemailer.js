const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config();
const googleApis = require("googleapis");
const REDIRECT_URI = `https://developers.google.com/oauthplayground`;
const CLIENT_ID = `453948582750-rcfrq24u05uaucu0vrboa89cr4ghaclk.apps.googleusercontent.com`;
// secret in .env

const authClient = new googleApis.google.auth.OAuth2(CLIENT_ID, process.env.CLIENT_SECRET,
    REDIRECT_URI);
authClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
async function sendMail(email, otp, user) {
    try {
        const ACCESS_TOKEN = await authClient.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "limitlessworld3@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: ACCESS_TOKEN
            }
        })
        const details = {
            from: "limitlessworld3@gmail.com",
            to: email,
            subject: "Superlist !! Do not Share or reply",
            text: "message text",
            html: `<h1>Your Spotify reset password otp is ${otp}</h1><h5> Profile Username: ${user} </h5>`
        }
        const result = await transport.sendMail(details);
        return result;
    }
    catch (err) {
        return err;
    }
}
// sendMail().then(res => {
//     console.log("sent mail !", res);
// })

module.exports = { sendMail: sendMail };