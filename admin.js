"use strict"

const commandLineArgs = require("command-line-args")
const commandLineUsage = require("command-line-usage")

const Joi = require("joi")

const { env, error } = require("tittles")
// Proceed .env.admin
env.config(".env.admin")

const pgp = require("pg-utl").init()

const { command } = require("./defs")

const {
  signUp,
  userIden,
} = require("./schemas/user")

const user = require("./auth/user")




// const { pgp } = importLazy("./pgp")

// const pos = importLazy("./pos/dal/pos")


// // process.on("unhandledRejection", error => {
// //   console.error("unhandledRejection", error)
// //   process.exit(error.code || 1)
// // })


const optionDefinitions = [
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Display this usage guide."
  },
  {
    name: "create-user",
    alias: "c",
    type: Boolean,
    description: "Create FFBA user."
  },
  {
    name: "list-users",
    alias: "l",
    type: Boolean,
    description: "List FFBA users."
  },
  {
    name: "token",
    alias: "t",
    type: Boolean,
    description: "Generate token for the user."
  },
  {
    name: "username",
    alias: "U",
    type: String,
    multiple: false,
    description: "Username.",
    typeLabel: "<username>"
  },
  {
    name: "email",
    alias: "E",
    type: String,
    multiple: false,
    description: "Email.",
    typeLabel: "<email>"
  },
  {
    name: "password",
    alias: "P",
    type: String,
    multiple: false,
    description: "Password.",
    typeLabel: "<password>"
  },
]


const admin = async () => {

  let db

  try {

    const options = commandLineArgs(optionDefinitions)

    if (options.help) {
      const usage = commandLineUsage([
        {
          header: "Typical Example",
          content: "A simple example demonstrating typical usage."
        },
        {
          header: "Options",
          optionList: optionDefinitions
        },
        {
          content: "Project home: {underline https://github.com/me/example}"
        }
      ])
      console.log(usage)
      return
    }

    let command_
    let options_

    if (options["create-user"]) {

      options_ = {
        username: options.username,
        email: options.email,
        password: options.password
      }

      const valid_ = Joi.validate(options_, signUp)
      if (valid_.error) {
        throw new Error(`Options validation error: ${valid_.error} (command: create-user)`)
      }

      command_ = command.CREATE_USER

    } else if (options.token) {

      options_ = {
        username: options.username,
      }

      const valid_ = Joi.validate(options_, userIden)
      if (valid_.error) {
        throw new Error(`Options validation error: ${valid_.error} (command: token)`)
      }

      command_ = command.TOKEN

    } else if (options["list-users"]) {

      command_ = command.LIST_USERS

    }

    db = pgp(process.env.SRV_DB_CONN_PARAMS)

    switch (command_) {

      case command.CREATE_USER:

        console.log("before SIGN_UP")
        await user.signUp(db, options_)
        console.log("after SIGN_UP")

        break

      case command.LIST_USERS:

        await user.list(db, options_)
        break

      case command.TOKEN:

        const { token, decoded } = await user.token(db, options_)

        console.log("token=", token)
        console.log("decoded: header=", decoded.header, "payload=", decoded.payload)

        break

      default:
        throw new Error(`Undefined command: ${command_}`)
    }

  } catch (e_) {
    console.error("admin:", error.print(e_, "\n"))

  } finally {

    // if (ctx_.session) {
    //   await pos_close(ctx_.srv.db, ctx_.session)
    // }

    // Close connections
    db && db.$pool.end()
  }

}





//         const ctx_ = {
//             srv: {
//                 db: pgp({
//                     connectionString: process.env[SRV_DB_CONN_PARAMS],
//                     idleTimeoutMillis: SRV_DBC_IDLE_TIMEOUT_MILLIS
//                 }),
//             },
//             cli: {},
//             home: process.env[POS_HOME] || POS_HOME_DEFAULT,
//             pos_ident: process.env[POS_IDENT],
//         }

//         let admin_command_ = admin_command.UNDEF

//         // if (!admin_command_) {
//         //   admin_command_ = defs.command.RUN
//         // }

//         //
//         // Retrieve POS information from server DB
//         //
//         // ctx_.cli.pos = await pos_open(ctx_.srv.db, process.env[defs.POS_IDENT])
//         // if (!ctx_.cli.pos) {
//         //   return
//         // }

//         // ctx_.session = ctx_.cli.pos.session

//         //
//         // Ensure defs.POS_HOME directory exists
//         //
//         // await fs.ensureDir(ctx_.home)

//         //
//         // Update file tree
//         //
//         // await deploy(ctx_.srv.db, ctx_.cli.pos, ctx_.home)

//         //
//         // Client DB connection
//         //
//         // ctx_.cli.db = pgp({
//         //   connectionString: ctx_.cli.pos.connection_uri,
//         //   idleTimeoutMillis: defs.CLI_DBC_IDLE_TIMEOUT_MILLIS,
//         // })

//         switch (admin_command_) {

//             case admin_command.RESTORE_POS:

//                 ctx_.srv.db.task("restore-pos", async task_ => {

//                     //
//                     // Retrieve POS information from server DB
//                     //
//                     ctx_.pos = await pos.selectByIdent(task_, { ident: ctx_.pos_ident })
//                     if (!ctx_.pos) {
//                         throw new Error("POS '${ctx_.pos_ident}' not found")
//                     }

//                     await restore(task_, ctx_)
//                 })

//                 break

//             default:
//                 throw new Error("Admin command undefined")
//         }



if (!module.parent) { admin() }
