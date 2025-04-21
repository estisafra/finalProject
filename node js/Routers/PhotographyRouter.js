const express = require("express");
const router = express.Router();
const { createPhotography, getAllPhotography, addImage, addResponse, getPhotographyByName, updatePersonalDetails,getAvailableDates,matchPhotography } = require("../Controllers/PhotographyController");
const { login, verifyToken } = require("../Middleware/authenticataion");

router.post("/login", login);
router.post("/createPhotography", createPhotography);
router.get("/getAllPhotography",verifyToken, getAllPhotography);
router.get("/getPhotographyByName/:photographyName",verifyToken, getPhotographyByName);
router.get("/getAvailableDates/:photographyId",verifyToken, getAvailableDates);//body-חודש ושנה partams-צלמת
router.put("/addResponse", verifyToken,addResponse); //וid צריך לקבל ב-body את ההמלצה
router.put("/addImage",verifyToken, addImage); // צריך לקבל ב-body תמונה
router.put("/updatePersonalDetails/:_id",verifyToken, updatePersonalDetails); // מקבל מיל טלפון וכתובת ב-body
router.get("/matchPhotography/",verifyToken, matchPhotography); //וid מקבל מחיר מינימלי ומקסימלי   ב-body

module.exports = router;
