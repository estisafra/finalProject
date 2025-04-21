const express = require("express")
const router = express.Router()
const multer = require("multer");
const { login, verifyToken } = require("../Middleware/authenticataion");
const upload = multer({ dest: "uploads/" }); // תיקיית יעד לשמירת הקבצים
const { createRenter,getRenterById,updatePersonalDetails,addAccessory} = require("../Controllers/RenterController")

router.post("/login", login);
router.post("/createRenter",createRenter)
router.get("/getRenterById/:_id",verifyToken,getRenterById)
//מקבל בbody 
router.put("/updatePersonalDetails/:_id",verifyToken,updatePersonalDetails)
//מקבל בbody פרטים ליצירת acvessory
router.put("/addAccessory/:renterId",verifyToken, upload.single("image"),addAccessory)
module.exports = router