const express = require("express")
const router = express.Router()
const { login, authenticateToken } = require("../Middleware/authenticataion");
const {getUserById,createUser,updateUserDetails,deleteUser,getAllUsers} = require("../Controllers/UserController")
router.post("/login", login);
router.post("/createUser",createUser)
router.delete("/deleteUser/:_id",authenticateToken,deleteUser)
router.get("/getUserById/:_id",authenticateToken,getUserById)
router.get("/getAllUsers",authenticateToken,getAllUsers)
//מקבל פרטים בbody
router.put("/updateUserDetails/:_id",authenticateToken,updateUserDetails)


module.exports = router