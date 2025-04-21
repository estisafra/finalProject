const express = require("express");
const router = express.Router();
const { sendEmails } = require("../Controllers/SystemController");
const { login } = require("../Middleware/authenticataion"); // ייבוא הפונקציה login
const {register}=require("../Middleware/authenticataion"); 
// ראוטים
router.post("/sendEmails", sendEmails);
router.post("/login", login); // הוספת ראוט עבור login
router.post("/register", register); // הוספת ראוט עבור register
module.exports = router;