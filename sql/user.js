"use strict"

const path = require("path")
const { stmt } = require("pg-utl")

module.exports = {

  add: stmt(path.join(__dirname, "user/add.sql")),
  list: stmt(path.join(__dirname, "user/list.sql")),

  find_by_id: stmt(path.join(__dirname, "user/find_by_id.sql")),
  find_by_username: stmt(path.join(__dirname, "user/find_by_username.sql")),
  find_by_email: stmt(path.join(__dirname, "user/find_by_email.sql")),
}
