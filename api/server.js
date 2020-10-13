const express = require('express')
const server = express()
server.use(express.json())


server,use(helmet())
server.use(cors())
module.exports = server; 

