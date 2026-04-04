const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ where: { google_id: profile.id } });
      
      if (!user) {
        // Try linking by email if google_id not found
        user = await User.findOne({ where: { email } });
        if (user) {
          user.google_id = profile.id;
          await user.save();
        } else {
          user = await User.create({
            email,
            display_name: profile.displayName,
            google_id: profile.id,
            avatar_url: profile.photos[0]?.value,
            password: 'oauth_password_placeholder' // Not used for OAuth users
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

// Microsoft Strategy
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: "/api/auth/microsoft/callback",
    scope: ['user.read'],
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0]?.value || `${profile.id}@microsoft.com`;
      let user = await User.findOne({ where: { microsoft_id: profile.id } });
      
      if (!user) {
        user = await User.findOne({ where: { email } });
        if (user) {
          user.microsoft_id = profile.id;
          await user.save();
        } else {
          user = await User.create({
            email,
            display_name: profile.displayName,
            microsoft_id: profile.id,
            password: 'oauth_password_placeholder'
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));
}

module.exports = passport;
