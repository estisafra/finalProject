
const mongoose = require("mongoose");
const Rent=require("../Modules/RentModule");
const User=require("../Modules/UserModule");
const Renter=require("../Modules/RenterModule");
const Accessory=require("../Modules/AccessoryModule");

async function createRent(req, res) {
    try {
        const rent = new Rent(req.body);  
        rent.rentReturnDate = new Date(rent.rentDate);
        rent.rentReturnDate.setDate(rent.rentDate.getDate() + 3);   
        await rent.save();
        
        let user = await User.findById(req.params.userId);
        user.userRent.push(rent._id);
        await user.save();

        res.status(201).send({ rent: rent });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

async function addAccessory(req, res) {
    try {
        const { userId, renterId } = req.params; 
        if (!req.body.rentDate) {
            return res.status(400).send("rentDate is required.");
        }
        
        const accessory = await Accessory.findById(req.body.accessoryId);
        if (!accessory) {
            return res.status(404).send("אביזר לא נמצא.");
        }
        
        const inputDate = new Date(req.body.rentDate).toISOString();  // המרת התאריך לפורמט ISO
        
        // בדוק אם התאריך תפוס
      const dateExists = accessory.accessoryRent.some(rent => {
      const rentDate = new Date(rent.date);
      const rentReturnDate = new Date(rent.returnDate); // הנחה שיש תאריך החזרה
      const inputDate = new Date(inputDate); // הנחה ש-inputDate הוא תאריך קלט

    return (inputDate >= rentDate && inputDate <= rentReturnDate) && 
           rent.renter.toString() === renterId; // בדיקה ישירה מול השוכר
});

        if (dateExists) {  // אם נמצא תאריך תפוס, הימנע מהוספה
            return res.status(409).send("תאריך זה כבר תפוס עבור השוכר.");
        }
        
        let rent = await Rent.findOne({ rentUser: userId, rentDate: req.body.rentDate });
        if (!rent) {
            rent = new Rent(req.body);  
            rent.rentReturnDate = new Date(rent.rentDate);
            rent.rentReturnDate.setDate(rent.rentDate.getDate() + 3);   
            await rent.save();
            
            let user = await User.findById(req.params.userId);
            user.userRent.push(rent._id);
            await user.save();
        }

        // הוספה למערך המוצרים בהזמנה
        rent.rentAccessories.push(req.body.accessoryId);
        rent.rentRenter = renterId; 
        await rent.save();

        // עדכון השוכרים
        const renter = await Renter.findById(renterId);
        renter.renterRents.push(rent._id); 
        await renter.save();

        // עדכון היסטוריית השכרת האביזר
        accessory.accessoryRent.push({ date: req.body.rentDate, renter: renterId });
        await accessory.save();

        res.status(201).send({ rent: rent });
    } catch (error) {
        res.status(400).send(error.message);
    }
}


async function getAllRents(req, res) {
    try {
        const rents = await Rent.find().populate('rentUser').populate('rentAccessories').populate('rentRenter');
        res.status(200).send({ rents: rents });
    } catch (error) {
        console.error(error); 
        res.status(400).send(error.message);
    }
}
async function getRentsByRenter(req, res) {
    const { renterId } = req.params; 
    try {
        const rents = await Rent.find({rentRenter:renterId}).populate('rentUser').populate('rentAccessories').populate('rentRenter');
        res.status(200).send({ rents: rents });
    } catch (error) {
        console.error(error); 
        res.status(400).send(error.message);
    }
}

async function deleteRent(req, res) {
    try {
        const rentId = req.params.rentId;

        // בדוק אם rentId הוא ObjectId תקין
        if (!mongoose.Types.ObjectId.isValid(rentId)) {
            return res.status(400).send("Invalid rent ID.");
        }

        // מצא את השכרה
        const rent = await Rent.findById(rentId);
        if (!rent) {
            return res.status(404).send("השכרה לא נמצאה.");
        }

        // עדכון טבלת Renters
        await Renter.updateOne(
            { renterRent: rentId },
            { $pull: { renterRents: rentId } }
        );

        // עדכון טבלת Users
        if (rent.rentUser) { // בדוק אם rentUser קיים
            await User.updateOne(
                { _id: rent.rentUser }, 
                { $pull: { userRent: rent._id } }
            );
        } else {
            console.error("rentUser is missing in the rent document.");
        }

        // עדכון טבלת Accessories
        await Accessory.updateMany(
            { accessoryRent: { $elemMatch: { rent: rentId } } },
            { $pull: { accessoryRent: { rent: rentId } } }
        );

        // מחק את השכרה
        await Rent.findByIdAndDelete(rentId);

        res.status(200).send("השכרה נמחקה בהצלחה.");
    } catch (error) {
        console.error(error); // לוג של השגיאה
        res.status(400).send(error.message);
    }
}

async function updateRent(req, res) {
    try {
        const rentId = req.params.id; 
        
        // מצא את השכרה
        const rent = await Rent.findById(rentId);
        if (!rent) {
            return res.status(404).send("השכרה לא נמצאה.");
        }

        // עדכון תאריך השכרה
        rent.rentDate = req.body.rentDate;
        rent.rentReturnDate.setDate(rent.rentDate.getDate() + 3);
        await rent.save(); // שמור את השינויים

        res.status(200).send("תאריך השכרה עודכן בהצלחה.");
    } catch (error) {
        console.error(error); // לוג של השגיאה
        res.status(400).send(error.message);
    }
}

async function removeAccessory(req, res) {
    try {
        const { userId, renterId } = req.params; 
        const accessoryId = req.body.accessoryId;
        const rentDate = req.body.rentDate;

        // מצא את השכרה לפי המשתמש ותאריך
        let rent = await Rent.findOne({ rentUser: userId, rentDate: rentDate });
        if (!rent) {
            return res.status(404).send("השכרה לא נמצאה.");
        }

        // בדוק אם האביזר קיים בהשכרה
        const accessoryIndex = rent.rentAccessories.indexOf(accessoryId);
        if (accessoryIndex === -1) {
            return res.status(404).send("אביזר לא נמצא בהשכרה.");
        }

        // הסר את האביזר מהשכרה
        rent.rentAccessories.splice(accessoryIndex, 1);
        await rent.save();

        // עדכון היסטוריית השכרת האביזר
        const accessory = await Accessory.findById(accessoryId);
        accessory.accessoryRent = accessory.accessoryRent.filter(rent => rent.renter.toString() !== renterId || rent.date !== rentDate);
        await accessory.save();

        res.status(200).send("אביזר נמחק בהצלחה מהשכרה.");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

async function checkOrCreateRent(req, res) {
    try {
        const { rentDate, renterId, accessoryId } = req.body;

        // בדוק אם יש השכרה קיימת בתאריך זה
        const existingRent = await Rent.findOne({
            rentDate: new Date(rentDate),
            rentAccessories: accessoryId,
        });

        if (!existingRent) {
            // אם אין השכרה, צור השכרה חדשה
            const newRent = new Rent({
                rentDate: new Date(rentDate),
                rentRenter: renterId,
                rentAccessories: [accessoryId],
            });
            await newRent.save();
            return res.status(201).send({ message: "New rent created" });
        }

        // אם יש השכרה קיימת, בדוק אם היא שייכת לאותו משכיר
        if (existingRent.rentRenter.toString() !== renterId) {
            return res
                .status(200)
                .send({ message: "Existing rent found for another renter" });
        }

        // אם ההשכרה שייכת לאותו משכיר, החזר הודעה מתאימה
        return res.status(200).send({ message: "Rent already exists for this renter" });
    } catch (error) {
        console.error("Error checking or creating rent:", error);
        res.status(500).send(error.message);
    }
}

module.exports={ deleteRent,createRent,addAccessory,getAllRents,updateRent,removeAccessory,getRentsByRenter,checkOrCreateRent}