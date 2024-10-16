import passport from "passport"
import GoogleStrategy from "passport-google-oauth2"
import jwt from "jsonwebtoken"

passport?.serializeUser((user, done) => {
    done(null, user)
})

passport?.deserializeUser((user, done) => {
    done(null, user!)
})

const STRATEGY = GoogleStrategy.Strategy
passport?.use(
    //@ts-ignore
    new STRATEGY(
        {
            //@ts-ignore
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/v1/auth/google/callback",
            passReqToCallback: true,
        },
        //@ts-ignore
        (request, accessToken, refreshToken, profile, done) => {
            const payload = {
                name: profile?.displayName,
                email: profile?.email,
                photo: profile?.picture,
            }

            const token = jwt.sign(payload, process?.env?.JWT_SECRET!, {
                expiresIn: 3600,
            })

            // NOTE: write login to store user's data into your database

            // from here it will go to callback url
            return done(null, { profile, accessToken: token })
        }
    )
)
