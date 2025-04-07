const express = require("express")
const router = express.Router()
const { createAccessory,deleteAccessory,getAccessoryByGallery,getAccessoryByRenter,updateAccessory,deleteAccessoryFromRenter,getAccessoryRentersDetails,getAllAccessory} = require("../Controllers/AccessoryController")

router.post("/createAccessory",createAccessory)
router.delete("/deleteAccessory/:id",deleteAccessory)
router.get("/getAllAccessory",getAllAccessory)
router.get("/getAccessoryByGallery/:gallery",getAccessoryByGallery)
router.get("/getAccessoryRentersDetails/:accessoryId",getAccessoryRentersDetails)
router.get("/getAccessoryByRenter/:renterId",getAccessoryByRenter)
router.put("/updateAccessory/:id",updateAccessory)
router.put("/deleteAccessoryFromRenter/:renterid",deleteAccessoryFromRenter)

module.exports=router