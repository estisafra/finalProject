const express = require("express")
const router = express.Router()
const multer = require("multer");
const { login, verifyToken } = require("../Middleware/authenticataion");
const upload = multer({ dest: "uploads/" }); // תיקיית יעד לשמירת הקבצים
const { createRenter,getRenterById,updatePersonalDetails,addAccessory,updateRentStatusToTrue} = require("../Controllers/RenterController")
router.post("/login", login);
router.post("/createRenter",createRenter)
router.get("/getRenterById/:_id",verifyToken,getRenterById)
router.put("/updatePersonalDetails/:_id",verifyToken,updatePersonalDetails)
router.put("/addAccessory/:renterId",verifyToken, upload.single("image"),addAccessory)
router.put("/updateRentStatusToTrue/:rentId",verifyToken,updateRentStatusToTrue)
module.exports = router