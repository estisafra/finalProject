const express = require("express")
const router = express.Router()
const { deleteRent,createRent,addAccessory,getAllRents,updateRent,removeAccessory,getRentsByRenter,checkOrCreateRent,getRentsByUser} = require("../Controllers/RentController")
const {  verifyToken } = require("../Middleware/authenticataion");

router.post("/createRent/userId",createRent)
router.delete("/deleteRent/:rentId",verifyToken,deleteRent)
router.get("/getAllRents",verifyToken,getAllRents)
router.put("/addAccessory/:userId/:renterId",verifyToken,addAccessory)
router.put("/removeAccessory/:userId/:renterId",verifyToken,removeAccessory)
router.put("/updateRent/:id",verifyToken,updateRent)
router.get("/getRentsByRenter/:renterId",verifyToken,getRentsByRenter)
router.post("/checkOrCreateRent",verifyToken,checkOrCreateRent)
router.get("/getRentsByUser/:userId",verifyToken,getRentsByUser)
module.exports = router