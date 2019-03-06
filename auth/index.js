"use strict"

let db

const user = require("./user")
const passport = require("./passport")
const token = require("./token")
const userSchema = require("../schemas/user")

module.exports = {

  init: params => {
    db = params.db
    passport.init({ db })
  },

  user,
  passport,
  token,
  userSchema,
}
