import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ email: profile.emails[0].value });

        if (user) {
          return done(null, user);
        }

        const newUser = new UserModel({
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0]?.value || "",
          password: "GOOGLE_AUTH_" + Math.random().toString(36).slice(-8),
          verify_email: true,
          status: "Active",
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;