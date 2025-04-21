const express = require("express")
const router = express.Router()
const { login, verifyToken } = require("../Middleware/authenticataion");
const {getUserById,createUser,updateUserDetails,deleteUser,getAllUsers} = require("../Controllers/UserController")
router.post("/login", login);
router.post("/createUser",createUser)
router.delete("/deleteUser/:_id",verifyToken,deleteUser)
router.get("/getUserById/:_id",verifyToken,getUserById)
router.get("/getAllUsers",verifyToken,getAllUsers)
//מקבל פרטים בbody
router.put("/updateUserDetails/:_id",verifyToken,updateUserDetails)


module.exports = router