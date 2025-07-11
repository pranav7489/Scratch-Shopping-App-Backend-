const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require("./config/mongoose-connection");
const usersRouter = require("./routes/usersRouter");
const ownersRouter = require("./routes/ownersRouter");
const productsRouter = require("./routes/productsRouter");
const index = require('./routes/index');
const expressSession = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'public')));

//const bcrypt = require('bcrypt');
// const userModel = require("./models/user-model");
// const postModel = require("./models/product-model");
//const jwt = require('jsonwebtoken');

app.set('view engine','ejs');
// basic / route
app.use(
   expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
// app.get('/test', (req, res) => {
//   req.flash('info', 'Flash message test!');
//   res.send('Flash set, go to /show');
// });
app.use("/" ,index);
app.use("/owners" ,ownersRouter);
app.use("/users",usersRouter);
app.use("/products",productsRouter);
app.listen(3000);
