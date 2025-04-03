const express = require("express")
const router = express.Router()
const { deleteRent,createRent,addAccessory,getAllRents,updateRent,removeAccessory} = require("../Controllers/RentController")


router.post("/createRent/userId",createRent)
router.delete("/deleteRent/:rentId",deleteRent)
router.get("/getAllRents",getAllRents)
// וdateמקבל idמוצר בבודי
router.put("/addAccessory/:userId/:renterId",addAccessory)
router.put("/removeAccessory/:userId/:renterId",removeAccessory)
//body- date
router.put("/updateRent/:id",updateRent)



module.exports = router