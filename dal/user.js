"use strict"

const user = require("../sql/user")


const add = async (db, params) => db.one(user.add, params)

const list = async (db, params) => db.any(user.list, params)

const findById = async (db, params) => db.oneOrNone(user.find_by_id, params)

const findByName = async (db, params) => db.oneOrNone(user.find_by_username, params)

const findByEmail = async (db, params) => db.oneOrNone(user.find_by_email, params)


module.exports = {

  add,
  list,

  findById,
  findByName,
  findByEmail,
}
