"use strict"

const jwt = require("jsonwebtoken")

const {
  JWT_SECRET,
} = require("../defs")


const sign = user => {

  // Check user.id is set
  if (!user.id) {
    throw new Error("User ID undefined")
  }

  return jwt.sign({
    iss: process.env.APP_IDEN || "GENERAL", // Application identifier
    sub: user.id, // SUBject
    iat: new Date().getTime(), // Issued At Time
    exp: new Date().setDate(new Date().getDate() + user.token_exp_days), // current datetime + user.token_exp_days
  }, JWT_SECRET)
}


const decode = token => jwt.decode(token, { complete: true })



module.exports = {
  sign,
  decode,
}
