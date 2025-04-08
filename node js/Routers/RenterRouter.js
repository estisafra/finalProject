const express = require("express")
const router = express.Router()
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // תיקיית יעד לשמירת הקבצים
const { createRenter,getRenterById,updatePersonalDetails,addAccessory} = require("../Controllers/RenterController")

router.post("/createRenter",createRenter)
router.get("/getRenterById/:_id",getRenterById)
//מקבל בbody 
router.put("/updatePersonalDetails/:_id",updatePersonalDetails)
//מקבל בbody פרטים ליצירת acvessory
router.put("/addAccessory/:renterId", upload.single("image"),addAccessory)
module.exports = router