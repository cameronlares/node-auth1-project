const express = require('express')
const server = express()
server.use(express.json())
const cors = require("cors");

const helmet = require("helmet");


server.use(helmet())
server.use(cors())
module.exports = server; 




const session = require("express-session");


const KnexSessionStore = require("connect-session-knex")(session); // for saving sessions to database


const usersRouter = require("../users/users-router.js");

const authRouter = require("../auth/auth-router");

const protected = require("../auth/protected-mw.js");

const connection = require("../database/connection");



const sessionConfiguration = {
    name: "monster", // defaults to sid for the cookie name
    secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
    cookie: {
        httpOnly: true, // true means JS can't access the cookie
        maxAge: 1000 * 60 * 10, // expires after 10 mins
        secure: process.env.SECURE_COOKIES || false, // true means send cookies over https only
    },
    resave: false, // re save the session information even if there are no changes
    saveUninitialized: true, // read about GDPR compliance
    store: new KnexSessionStore({
        knex: connection, // connection to the database
        tablename: "sessions",
        sidfieldname: "sid", // name of session id column
        createtable: true, // if the table doesn't exist, create it
        clearInterval: 1000 * 60 * 60, // remove expired sessions from the database every hour
    }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfiguration));

server.use("/api/auth", authRouter);
server.use("/api/users", protected, usersRouter);

server.get("/", (req, res) => {
    res.json({ api: "up", session: req.session });
});

// $2a$06$HNclIX8/MwrOjK3iniVpWOFsgr5c18hfLg/96Os0Rou279fx5EFDS
// $2a$06$0ZuCpF12yW7hhHAH6Bcj5esojIyonZh/B3LDGUDrr6aXtfMiydyEa

module.exports = server;
