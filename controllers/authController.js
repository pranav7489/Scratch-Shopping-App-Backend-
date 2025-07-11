const userModel = require("../models/user-model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require("../utils/generateToken");
module.exports.registerUser = async function(req,res){
    try{
         let{email,password,fullname} = req.body;
     //you can add joy here 
      let user = await userModel.findOne({email:email});
      if(user) return res.status(401).send("you already have an account, please login");
     bcrypt.genSalt(10, function(err, salt) {
       bcrypt.hash(password, salt, async function(err, hash) {
        // Store hash in your password DB.
        if(err) return res.send(err.message);
        else {
            let user =  await userModel.create({
          email,
          password:hash,
           fullname,
     });
    //   res.send(user);
    let token = generateToken(user);
   res.cookie("token",token);
   res.send("user created successfully");
        } 
    });
});
   
    } catch(err){
        console.log(err.message);
    }
};
module.exports.loginUser = async (req,res)=>{
    let {email,password} = req.body;
    let user = await userModel.findOne({email:email});
    if(!user) return res.send("email or password incorrect");

    bcrypt.compare(password,user.password,function(err,result){
        if(result){
        let token = generateToken(user);
        res.cookie("token",token);
        res.redirect("/shop");
        }
        else return res.send("email or password incorrect");
    })
}
module.exports.logoutUser = function(req,res){
    res.cookie("token","");
    res.redirect("/");
}