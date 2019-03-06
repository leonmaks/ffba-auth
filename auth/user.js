const bcrypt = require("bcryptjs")

const { Exception } = require("tittles")

const {
  BCRYPT_SALT_ROUNDS,
} = require("../defs")

const user = require("../dal/user")
const { sign, decode } = require("./token")


// Password hash generator
const passwordHash = async password => bcrypt.hash(password, await bcrypt.genSalt(BCRYPT_SALT_ROUNDS))

const comparePassword = async (candidatePassword, hash) => bcrypt.compare(candidatePassword, hash)

const list = async (db, params) => {
  const users_ = await user.list(db, params)
  users_.forEach(u_ => console.log("User", u_))
}

const token = async (db, params) => {
  const token_ = sign(await user.findByName(db, params))
  return {
    token: token_,
    decoded: decode(token_),
  }
}


const signUp = async (db, params) => db.task("user.signUp", async task => {

  // Check if USERNAME is already in use
  if (await user.findByName(task, params)) {
    throw new Exception(422, `Username '${params.username}' is already in use`)
  }

  // Check if EMAIL is already in use
  if (await user.findByEmail(task, params)) {
    throw new Exception(422, `Email '${params.email}' is already in use`)
  }

  const result_ = {}

  try {

    result_.user = await user.add(task, { ...params, password: await passwordHash(params.password) })
    result_.token = sign(result_.user)

  } catch (e_) {
    throw new Exception(500, "Internal server error; new user not registered")
  }
  return result_
})



module.exports = {

  list,
  token,

  signUp,

  comparePassword,
}




//     // Create new user
//     try {

//       const newUser = await User.addUser({ username, email, password })

//       const token = signToken(newUser)

//       // Respond with token
//       res.status(201).json({
//         success: true,
//         message: "New user registered",
//         user: {
//           id: newUser.id,
//           username: newUser.username,
//           email: newUser.email,
//         },
//         token,
//       })

//     } catch (error) {
//       // TODO: log error
//       return res.status(500).json({
//         success: false,
//         message: "500 - internal server error. New user not registered.",
//       })
//     }



// // Check if USERNAME is already in use
// if (await User.findByEmail(email)) {
//   return res.status(422).json({
//     success: false,
//     error: "Email is already in use",
//   })
// }

// // Create new user
// try {

//   const newUser = await User.addUser({ username, email, password })

//   const token = signToken(newUser)

//   // Respond with token
//   res.status(201).json({
//     success: true,
//     message: "New user registered",
//     user: {
//       id: newUser.id,
//       username: newUser.username,
//       email: newUser.email,
//     },
//     token,
//   })

// } catch (error) {
//   // TODO: log error
//   return res.status(500).json({
//     success: false,
//     message: "500 - internal server error. New user not registered.",
//   })
// }








// const jwt = require("jsonwebtoken")

// const { APP_ID, JWT_SECRET, TOKEN_EXP_DAYS } = require("@config")

// const db = require("@root/db")
// const { user } = require("ffba-auth")

// const signToken = user => {
//   console.log("signToken: user.id=", user.id)
//   // Check user.id is set
//   if (!user.id) {
//     throw new Error("User's ID shouldn't be empty")
//   }
//   return jwt.sign({
//     iss: `${APP_ID}`,
//     sub: user.id, // SUBject
//     iat: new Date().getTime(), // Issued At Time
//     exp: new Date().setDate(new Date().getDate() + TOKEN_EXP_DAYS), // current datetime + TOKEN_EXP_DAYS
//   }, JWT_SECRET)
// }

// module.exports = {

//   // Register NEW User
//   signUp: async (req, res, next) => {

//     const { username, email, password } = req.value.body

//     console.log("XXX: username", username, ", db=", db)

//     // Check if USERNAME is already in use
//     if (await user.findByName(db, username)) {
//       return res.status(422).json({
//         success: false,
//         error: "Username is already in use",
//       })
//     }

//     // Check if USERNAME is already in use
//     if (await User.findByEmail(email)) {
//       return res.status(422).json({
//         success: false,
//         error: "Email is already in use",
//       })
//     }

//     // Create new user
//     try {

//       const newUser = await User.addUser({ username, email, password })

//       const token = signToken(newUser)

//       // Respond with token
//       res.status(201).json({
//         success: true,
//         message: "New user registered",
//         user: {
//           id: newUser.id,
//           username: newUser.username,
//           email: newUser.email,
//         },
//         token,
//       })

//     } catch (error) {
//       // TODO: log error
//       return res.status(500).json({
//         success: false,
//         message: "500 - internal server error. New user not registered.",
//       })
//     }

//   },

//   // User sign in
//   signIn: async (req, res, next) => {

//     console.log("signIn: req.user=", req.user)

//     try {

//       // Generate token
//       const token = signToken(req.user)

//       console.log("signIn: response=", { token, isSuperuser: req.user.is_superuser })


//       // Response with token
//       res.status(200).json({ token, isSuperuser: req.user.is_superuser })

//     } catch (error) {
//       // TODO: log error
//       return res.status(500).json({
//         success: false,
//         message: "500 - internal server error: user not signed in",
//       })
//     }
//   },

//   // Set password
//   passwd: async (req, res, next) => {

//     const { username, password } = req.value.body

//     try {
//       const user = await User.findByUserName(username)


//     } catch (error) {
//       // TODO: log error
//       return res.status(500).json({
//         success: false,
//         message: "500 - internal server error: password not set",
//       })
//     }


//     // Get user by USERNAME


//     if () {
//       return res.status(422).json({
//         success: false,
//         error: "Username is already in use",
//       })
//     }

//     // Check if USERNAME is already in use
//     if (await User.findByEmail(email)) {
//       return res.status(422).json({
//         success: false,
//         error: "Email is already in use",
//       })
//     }

//     // Create new user
//     try {

//       const newUser = await User.addUser({ username, email, password })

//       const token = signToken(newUser)

//       // Respond with token
//       res.status(201).json({
//         success: true,
//         message: "New user registered",
//         user: {
//           id: newUser.id,
//           username: newUser.username,
//           email: newUser.email,
//         },
//         token,
//       })

//     } catch (error) {
//       // TODO: log error
//       return res.status(500).json({
//         success: false,
//         message: "500 - internal server error. New user not registered.",
//       })
//     }
//   },
// }
