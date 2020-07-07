require('dotenv').config()

let PORT = process.env.BLOG_PORT
let MONGODB_URI = process.env.BLOG_URI

module.exports = { MONGODB_URI, PORT }
