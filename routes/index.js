const express = require('express');
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggeddin");
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
router.get("/",(req,res)=>{
    let error = req.flash("error");
    res.render("index",{error,loggedin:false});
});
// basic /shop route
// router.get("/shop",isLoggedin,async (req,res)=>{
//   let products = await productModel.find();
//   let success = req.flash("success");
//     res.render("shop",{products,success});
// })

router.get("/shop", isLoggedin, async (req, res) => {
  try {
    /* ---------- 1. NORMALISE QUERY‑STRING VALUES ---------- */
    const rawFilter = (req.query.filter || "all").toLowerCase();   // 'available' | 'discounted' | 'all'
    const sortby    = (req.query.sortby  || "popular").toLowerCase();

    /* ---------- 2. BUILD MONGODB FILTER ---------- */
    // empty object means "no constraints"  →  show every product
    const mongoFilter = {};
    if (rawFilter === "discounted") {
      mongoFilter.discount = { $gt: 0 };       // expects numeric "discount" field
    } else if (rawFilter === "available") {
      mongoFilter.inStock = true;              // expects boolean "inStock" field
    }
    // rawFilter === 'all' → leave mongoFilter empty

    /* ---------- 3. CHOOSE SORT ORDER ---------- */
    const sortMap = {
      popular     : { sold      : -1 },  // highest sales first
      newest      : { createdAt : -1 },  // latest first
      "price-asc" : { price     :  1 },
      "price-desc": { price     : -1 },
    };
    const sortOption = sortMap[sortby] || {}; // empty ⇒ MongoDB’s natural order

    /* ---------- 4. QUERY DATABASE ---------- */
    const products = await productModel
      .find(mongoFilter)
      .sort(sortOption)
      .lean();                               // lean() → plain JS objects are faster for EJS

    /* ---------- 5. RENDER TEMPLATE ---------- */
    const successMsg = (req.flash && req.flash("success")[0]) || ""; // handle connect‑flash array

    res.render("shop", {
      products,
      success: successMsg,
      filter : rawFilter,   // drives active link in the sidebar
      sortby : sortby,      // keeps <select> in sync
    });
  } catch (err) {
    console.error("GET /shop error:", err);
    res.status(500).send("Server Error");
  }
});


// ...basic get routes 
// router.get("/cart",isLoggedin,async (req,res)=>{
//   let user = await userModel.findOne({email: req.user.email}).populate("cart");
//  const bill = Number(user.cart[0].price+20)-Number(user.cart[0].discount);
//     res.render("cart",{user,bill});
// })
router.get("/cart", isLoggedin, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email }).populate("cart");

  let bill = 0;
  let cartWithTotals = user.cart.map(item => {
    const subtotal = Number(item.price) + 20 - Number(item.discount || 0);
    bill += subtotal;
    return { ...item._doc, subtotal };
  });

  res.render("cart", { user: { ...user._doc, cart: cartWithTotals }, bill });
});

router.get('/profile',isLoggedin, async (req, res, next) => {
  try {
   let user = await userModel.findOne({ email: req.user.email });
    if (!user) return res.redirect('/');

    res.render('profile', { user });
  } catch (err) {
    next(err);
  }
});
router.get("/addtocart/:productid",isLoggedin, async (req,res)=>{
    let user = await userModel.findOne({email:req.user.email});
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success","Added to Cart");
    res.redirect("/shop");
})
router.get("/logout", isLoggedin,(req,res)=>{
    res.redirect("/users/logout");
})
module.exports = router;