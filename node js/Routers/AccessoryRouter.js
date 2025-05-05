const express = require("express")
const router = express.Router()
const { createAccessory,deleteAccessory,getAccessoryByGallery,getAccessoryByRenter,updateAccessory,deleteAccessoryFromRenter,getAccessoryRentersDetails,getAllAccessory,getOccupiedDates } = require("../Controllers/AccessoryController")
const { verifyToken } = require("../Middleware/authenticataion");
router.post("/createAccessory",createAccessory)
router.delete("/deleteAccessory/:id",verifyToken,deleteAccessory)
router.get("/getAllAccessory",verifyToken,getAllAccessory)
router.get("/getAccessoryByGallery/:gallery",verifyToken,getAccessoryByGallery)
router.get("/getAccessoryRentersDetails/:accessoryId",verifyToken,getAccessoryRentersDetails)
router.get("/getAccessoryByRenter/:renterId",verifyToken,getAccessoryByRenter)
router.put("/updateAccessory/:id",verifyToken,updateAccessory)
router.put("/deleteAccessoryFromRenter/:renterid",verifyToken,deleteAccessoryFromRenter)
router.get("/getOccupiedDates",verifyToken,getOccupiedDates)
module.exports=router