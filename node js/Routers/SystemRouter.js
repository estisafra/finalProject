const express = require("express")
const router = express.Router()
const { sendEmails} = require("../Controllers/SystemController")
router.post("/sendEmails", sendEmails);

module.exports = router