"use strict"

const passport = require("passport")
const JwtStrategy = require("passport-jwt").Strategy
const LocalStrategy = require("passport-local").Strategy
const { ExtractJwt } = require("passport-jwt")

const { JWT_SECRET } = require("../defs")

const user_dal = require("../dal/user")

const { comparePassword } = require("./user")


let db


//
// JSON Web Tokens strategy
//
passport.use(new JwtStrategy({

  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: JWT_SECRET,

}, async (payload, done) => {

  try {

    // Find the user specified in token
    const user_ = await user_dal.findById(db, { id: payload.sub })

    // Handle if USER doesn't exist
    if (!user_) {
      // TODO: error === null ? "User not found!"
      return done(null, false)
    }

    // Otherwise, return USER
    done(null, user_)

  } catch (error) {
    done(error, false)
  }
}))


//
// Local strategy
//
passport.use(new LocalStrategy({

  usernameField: "username",

}, async (username, password, done) => {

  try {

    // Find the user given the username
    const user_ = await user_dal.findByName(db, { username })

    // If not, handle it
    if (!user_) {
      // TODO: error === null ? "User not found!"
      return done(null, false)
    }

    // Check if the password is correct
    const isMatch = await comparePassword(password, user_.password)

    // If not, handle it
    if (!isMatch) {
      // TODO: error === null ? "Incorrect password!"
      return done(null, false)
    }

    // Otherwise, return the user
    done(null, user_)

  } catch (error) {
    // TODO: hide internal error stack - do not show it to the client
    done(error, false)
  }
}))


module.exports = {

  init: params => {
    db = params.db
  },

  local: passport.authenticate("local", { session: false }),
  JWT: passport.authenticate("jwt", { session: false }),
}
