const Joi = require("joi")

const usernamePattern = Joi.string().regex(/^[_a-zA-Z0-9]{2,50}$/).required()
const emailPattern = Joi.string().email({ minDomainAtoms: 2 }).required()
const passwordPattern = Joi.string().regex(/^[a-zA-Z0-9]{6,50}$/).required()



module.exports = {

  userIden: Joi.object().keys({
    username: usernamePattern,
  }),

  signUp: Joi.object().keys({
    username: usernamePattern,
    email: emailPattern,
    password: passwordPattern,
  }),

  signIn: Joi.object().keys({
    username: usernamePattern,
    password: passwordPattern,
  }),
}
