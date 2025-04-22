const express = require("express")
const router = express.Router()
const { createOrder,deleteOrder,getOrdersByPhotography,updatePhotography,getOrdersByUser,updateDate} = require("../Controllers/OrderController")
const { verifyToken } = require("../Middleware/authenticataion");

router.post("/createOrder",createOrder)
router.delete("/deleteOrder/:id",verifyToken,deleteOrder)
router.get("/getOrdersByPhotography/:photographyId",verifyToken,getOrdersByPhotography)
router.get("/getOrdersByUser/:userId",verifyToken,getOrdersByUser,)
router.put("/updatePhotography/:orderId",verifyToken,updatePhotography)
router.put("/updateDate/:id",verifyToken,updateDate)


module.exports = router