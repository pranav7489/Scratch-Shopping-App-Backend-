const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const {registerUser} = require("../controllers/authController");
const {loginUser} = require("../controllers/authController");
const{logoutUser} = require('../controllers/authController');
router.get("/",function(req,res){
    res.send("hey");
});
router.post("/register", registerUser);
router.post("/login" ,loginUser);
router.get("/logout",logoutUser);
module.exports = router;