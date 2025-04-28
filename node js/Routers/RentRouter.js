const express = require("express")
const router = express.Router()
const { deleteRent,createRent,addAccessory,getAllRents,updateRent,removeAccessory,getRentsByRenter,checkOrCreateRent} = require("../Controllers/RentController")
const {  verifyToken } = require("../Middleware/authenticataion");

router.post("/createRent/userId",createRent)
router.delete("/deleteRent/:rentId",verifyToken,deleteRent)
router.get("/getAllRents",verifyToken,getAllRents)
// וdateמקבל idמוצר בבודי
router.put("/addAccessory/:userId/:renterId",verifyToken,addAccessory)
router.put("/removeAccessory/:userId/:renterId",verifyToken,removeAccessory)
//body- date
router.put("/updateRent/:id",verifyToken,updateRent)
router.get("/getRentsByRenter/:renterId",verifyToken,getRentsByRenter)
router.post("/checkOrCreateRent",verifyToken,checkOrCreateRent)

module.exports = router