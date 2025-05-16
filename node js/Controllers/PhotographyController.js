const mongoose = require("mongoose");
const moment = require('moment');
const Photography = require("../Modules/PhotographyModule");
const Users = require("../Modules/UserModule");
const Orders = require("../Modules/OrderModule");
const bcrypt = require("bcryptjs");


const createPhotography = async (req) => {
    try {
        console.log(req.body);
        const newPhotography = new Photography(req.body);
        const hashedPassword = await bcrypt.hash(newPhotography.photographyPassword, 10);
        newPhotography.photographyPassword = hashedPassword;
        await newPhotography.save();
        return newPhotography; // החזרת האובייקט שנשמר
    } catch (error) {
        throw new Error(error.message); // זריקת שגיאה
    }
};


const getAllPhotography = async (req, res) => {
    try {
        const allPhotography = await Photography.find();
        res.status(200).send(allPhotography);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const addImage = async (req, res) => {
    const { photographyId, imageUrl, gallery } = req.body;
    if (!photographyId || !imageUrl || !gallery) {
        return res.status(400).send("photographyId, imageUrl ו-gallery הם חובה.");
    }
    try {
        const photography = await Photography.findById(photographyId);
        if (!photography) {
            return res.status(404).send("צילום לא נמצא.");
        }

        photography.photographyImages.push({ url: imageUrl, galery: gallery });
        await photography.save();
        res.status(200).send(photography);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const addResponse = async (req, res) => {
    const { photographyId, response } = req.body;
    if (!photographyId || !response) {
        return res.status(400).send("photographyId ו-response הם חובה.");
    }
    try {
        const photography = await Photography.findById(photographyId);
        if (!photography) {
            return res.status(404).send("צילום לא נמצא.");
        }
        photography.photographyResponse.push(response);
        await photography.save();
        res.status(200).send(photography);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getPhotographyByName = async (req, res) => {
    const { photographyName } = req.params;
    try {
        const photography = await Photography.findOne({ photographyName: photographyName });
        if (!photography) {
            return res.status(404).send("צלם לא נמצא.");
        }
        res.status(200).send(photography);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updatePersonalDetails = async (req, res) => {
    try {
        const { _id } = req.params; // השתמש בפרמטרים במקום בגוף הבקשה
        const photography = await Photography.findById(_id);
        if (!photography) {
            return res.status(404).send("צילום לא נמצא.");
        }
        Object.assign(photography, req.body); // עדכון הפרטים
        const updatedPhotography = await photography.save(); // שמירה של האובייקט המעודכן
        res.status(200).send(updatedPhotography);
    } catch (error) {
        res.status(500).send(error.message);
    }
};


async function matchPhotography(req, res) {
    const { userId, minPrice, maxPrice } = req.body;
    // if (!userId || minPrice === undefined || maxPrice === undefined) {
    //     return res.status(400).send("userId, minPrice ו-maxPrice הם חובה.");
    // }
    try {
        // חיפוש הלקוח לפי userId
        const client = await Users.findById(userId);
        if (!client) {
            return res.status(404).send("לקוח לא נמצא.");
        }

        const clientLocation = client.userAddress; 

        // חיפוש הצלמות המתאימות
        const matchedPhotographers = await Photography.find({
            photographyAddress: clientLocation,
            'photographyGaleries.minPrice': { $lte: maxPrice },
            'photographyGaleries.maxPrice': { $gte: minPrice }
        });

        if (matchedPhotographers.length === 0) {
            return res.status(404).send("לא נמצאו צלמות מתאימות.");
        }

        res.status(200).send(matchedPhotographers);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function getAvailableDates(req, res) {
    const { photographyId } = req.params;
    let { month, year } = req.query;

    try {
        // ודא ששני הספרות של החודש תמיד בפורמט תקני
        month = month.toString().padStart(2, '0');

        // חיפוש הזמנות של הצלמת בחודש ובשנה שנבחרו
        const monthStart = moment(`${year}-${month}-01`, "YYYY-MM-DD").startOf('month').toDate();
        const monthEnd = moment(`${year}-${month}-01`, "YYYY-MM-DD").endOf('month').toDate();

        const orders = await Orders.find({
            orderPhotography: photographyId,
            orderDate: {
                $gte: monthStart,
                $lt: monthEnd
            }
        });

        // יצירת מערך של כל התאריכים בחודש המבוקש
        const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
        const allDates = Array.from({ length: daysInMonth }, (_, i) => {
            const dayStr = (i + 1).toString().padStart(2, '0');
            return moment(`${year}-${month}-${dayStr}`, "YYYY-MM-DD").toDate();
        });

        // סינון התאריכים הפנויים
        const bookedDates = orders.map(order => order.orderDate.toISOString().split('T')[0]);
        const availableDates = allDates.filter(date => !bookedDates.includes(date.toISOString().split('T')[0]));

        return res.status(200).send(availableDates);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
module.exports = {
    createPhotography,
    getAllPhotography,
    addImage,
    addResponse,
    getPhotographyByName,
    updatePersonalDetails,
    matchPhotography,
    getAvailableDates
};
