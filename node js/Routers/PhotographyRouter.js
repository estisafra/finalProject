const express = require("express");
const router = express.Router();
const { createPhotography, getAllPhotography, addImage, addResponse, getPhotographyByName, updatePersonalDetails,getAvailableDates,matchPhotography } = require("../Controllers/PhotographyController");

router.post("/createPhotography", createPhotography);
router.get("/getAllPhotography", getAllPhotography);
router.get("/getPhotographyByName/:photographyName", getPhotographyByName);
router.get("/getAvailableDates/:photographyId", getAvailableDates);//body-חודש ושנה partams-צלמת
router.put("/addResponse", addResponse); //וid צריך לקבל ב-body את ההמלצה
router.put("/addImage", addImage); // צריך לקבל ב-body תמונה
router.put("/updatePersonalDetails/:_id", updatePersonalDetails); // מקבל מיל טלפון וכתובת ב-body
router.get("/matchPhotography/", matchPhotography); //וid מקבל מחיר מינימלי ומקסימלי   ב-body

module.exports = router;
