const express = require("express");
const multer = require("multer"); // ייבוא multer
const upload = multer({ dest: "uploads/" }); // הגדרת תיקיית יעד לשמירת הקבצים
const router = express.Router();
const { sendEmails } = require("../Controllers/SystemController");
const { login, register } = require("../Middleware/authenticataion");

// ראוטים
router.post("/sendEmails", sendEmails);
router.post("/login", login); // הוספת ראוט עבור login
router.post("/register",upload.array("allImages"), register); // הוספת ראוט עבור register

module.exports = router;