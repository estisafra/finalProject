const express = require("express")
const router = express.Router()
const { createRenter,getRenterById,updatePersonalDetails,addAccessory} = require("../Controllers/RenterController")

router.post("/createRenter",createRenter)
router.get("/getRenterById/:_id",getRenterById)
//מקבל בbody 
router.put("/updatePersonalDetails/:_id",updatePersonalDetails)
//מקבל בbody פרטים ליצירת acvessory
router.put("/addAccessory/:renterId",addAccessory)
module.exports = router