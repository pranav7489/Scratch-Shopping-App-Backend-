const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const userModel = require("./models/user");
const postModel = require("./models/post");
const jwt = require('jsonwebtoken');
app.set('view engine','ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, 'public')));

// basic / route
app.get("/",(req,res)=>{
     res.send("hii");
})
app.listen(3000);
