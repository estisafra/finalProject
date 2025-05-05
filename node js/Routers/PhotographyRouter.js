const express = require("express");
const router = express.Router();
const { createPhotography, getAllPhotography, addImage, addResponse, getPhotographyByName, updatePersonalDetails,getAvailableDates,matchPhotography } = require("../Controllers/PhotographyController");
const { login, verifyToken } = require("../Middleware/authenticataion");
router.post("/login", login);
router.post("/createPhotography", createPhotography);
router.get("/getAllPhotography",verifyToken, getAllPhotography);
router.get("/getPhotographyByName/:photographyName",verifyToken, getPhotographyByName);
router.get("/getAvailableDates/:photographyId",verifyToken, getAvailableDates);
router.put("/addResponse", verifyToken,addResponse); 
router.put("/addImage",verifyToken, addImage); 
router.put("/updatePersonalDetails/:_id",verifyToken, updatePersonalDetails); 
router.get("/matchPhotography/",verifyToken, matchPhotography); 

module.exports = router;
