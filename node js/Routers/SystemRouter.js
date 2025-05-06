const express = require("express");
const multer = require("multer"); 
const upload = multer({ dest: "uploads/" }); 
const router = express.Router();
const { sendEmails } = require("../Controllers/SystemController");
const { login, register } = require("../Middleware/authenticataion");
router.post("/sendEmails", sendEmails);
router.post("/login", login); 
router.post("/register", upload.array('images'), register); 


module.exports = router;
