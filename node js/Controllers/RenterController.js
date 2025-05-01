const Renter=require("../Modules/RenterModule");
const Accessory=require("../Modules/AccessoryModule")
const Rent = require("../Modules/RentModule");
const { createAccessory } = require("../Controllers/AccessoryController");
const bcrypt = require("bcryptjs");

const _ = require('lodash');

async function createRenter(req, res) {
    try {
        const renter = new Renter(req.body);

        const hashedPassword = await bcrypt.hash(renter.renterPassword, 10);
        renter.renterPassword = hashedPassword;
        await renter.save();

        // החזרת המידע של השוכר שנוצר
        return renter; // להחזיר את האובייקט renter
    } catch (error) {
        console.error("Error during registration:", error.message);
        throw new Error(error.message); // לזרוק שגיאה
    }
}


async function getRenterById(req,res){
    try {
            const {_id} = req.params;
            let renter = await Renter.findById(_id)
            if (!renter) {
               res.status(404).send(null);
            }
            else res.status(200).send(renter);
        } catch (error) {
            res.status(500).send(error.message);
        }
}
async function updatePersonalDetails(req, res)  {
    try {
        let { _id } = req.params;
        let renter = await Renter.findById(_id);
        if (!renter) {
            return res.status(404).send('User not found');
        }
        _.assign(renter, req.body);
        let updated = await renter.save();
        res.status(200).send(updated);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
async function addAccessory(req, res) {
    try {
        const { renterId } = req.params;
        const { accessoryName, price } = req.body;
        const image = req.file ? req.file.path : null; // נתיב התמונה שהועלתה

        // בדיקה אם האביזר כבר קיים
        let accessory = await Accessory.findOne({ accessoryName });
        if (!accessory) {
            accessory = new Accessory({
                accessoryName,
                accessoryRenter: [],
                accessoryRent: [],
            });
            await accessory.save();
        }

        // בדיקה אם המשכיר קיים
        const renterDoc = await Renter.findById(renterId);
        if (!renterDoc) {
            return res.status(404).send("Renter not found");
        }

        // הוספת האביזר למשכיר
        renterDoc.renterAccessory.push({
            accessory: accessory._id,
        });

        // הוספת המשכיר לאביזר
        accessory.accessoryRenter.push({
            renter: renterDoc._id,
            price,
            image,
        });

        await renterDoc.save();
        await accessory.save();

        res.status(200).send({ message: "Accessory added successfully", accessory });
    } catch (error) {
        console.error("Error adding accessory:", error);
        res.status(500).send(error.message);
    }
}
    async function updateRentStatusToTrue(req, res) {
        const { rentId } = req.params;
    
        try {
            const updatedRent = await Rent.findByIdAndUpdate(
                rentId,
                { status: true },
                { new: true } // מחזיר את המסמך המעודכן
            );
    
            if (!updatedRent) {
                return res.status(404).send({ message: "השכרה לא נמצאה" });
            }
    
            res.status(200).send({ message: "הסטטוס עודכן בהצלחה", rent: updatedRent });
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: error.message });
        }
    }
    
module.exports={createRenter,getRenterById,addAccessory,updatePersonalDetails,updateRentStatusToTrue}