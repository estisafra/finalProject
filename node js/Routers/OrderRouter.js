const express = require("express")
const router = express.Router()
const { createOrder,deleteOrder,getOrdersByPhotography,updatePhotography,getOrdersByUser,updateDate} = require("../Controllers/OrderController")

router.post("/createOrder",createOrder)
router.delete("/deleteOrder/:id",deleteOrder)
router.get("/getOrdersByPhotography/:photographyId",getOrdersByPhotography)
router.get("/getOrdersByUser/:userId",getOrdersByUser)
router.put("/updatePhotography/:orderId",updatePhotography)
router.put("/updateDate/:id",updateDate)


module.exports = router