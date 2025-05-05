
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
        
        const accessory = await Accessory.findById(req.body.accessoryId).populate({
            path: 'accessoryRenter.renter',
            model: 'Renters'
        });
        if (!accessory) {
            return res.status(404).send("אביזר לא נמצא.");
        }
        
        const inputDate = new Date(req.body.rentDate); // תאריך ההשכרה
        const returnDate = new Date(inputDate); // תאריך החזרה
        returnDate.setDate(inputDate.getDate() + 1); // הוסף יום אחד לתאריך ההשכרה

        // בדוק אם התאריכים תפוסים
        const isDateOccupied = accessory.accessoryRent.some(rent => {
            const rentStartDate = new Date(rent.date);
            const rentEndDate = rent.returnDate ? new Date(rent.returnDate) : rentStartDate;

            // בדוק אם יש חפיפה בין הטווחים
            return (
                (inputDate >= rentStartDate && inputDate <= rentEndDate) || // inputDate בתוך הטווח
                (returnDate >= rentStartDate && returnDate <= rentEndDate) || // returnDate בתוך הטווח
                (inputDate <= rentStartDate && returnDate >= rentEndDate) // טווח חדש מכסה את הטווח הקיים
            );
        });

        if (isDateOccupied) { // אם נמצא תאריך תפוס, הימנע מהוספה
            return res.status(409).send("תאריכים אלו כבר תפוסים עבור האביזר.");
        }
        
        let rent = await Rent.findOne({ rentUser: userId, rentDate: req.body.rentDate });
        if (!rent) {
            rent = new Rent(req.body);  
            rent.rentReturnDate = returnDate;   
            await rent.save();
            
            let user = await User.findById(req.params.userId);
            user.userRent.push(rent._id);
            await user.save();
        }

        // הוספה למערך המוצרים בהזמנה
        rent.rentAccessories.push(req.body.accessoryId);
        rent.rentRenter = renterId; 
        await rent.save();

        // עדכון היסטוריית השכרת האביזר
       // עדכון היסטוריית השכרת האביזר
    accessory.accessoryRent.push({ 
       date: req.body.rentDate, 
       renter: renterId 
     });
await accessory.save();
        await accessory.save();

        // מציאת התמונה המתאימה לפי המשכיר
        const matching = accessory.accessoryRenter.find(ar => 
            ar.renter && ar.renter._id.toString() === renterId.toString()
        );
        const matchedImage = matching?.image || null;

        res.status(201).send({ 
            rent: rent, 
            accessory: {
                ...accessory.toObject(),
                matchedImage: matchedImage
            }
        });
    } catch (error) {
        console.error("Error in addAccessory:", error.message);
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
        const now = new Date();
        const rents = await Rent.find({
            rentRenter: renterId,
            rentReturnDate: { $gt: now } // רק השכרות שתאריך ההחזרה עוד לא עבר
        })
        .populate('rentUser')
        .populate('rentAccessories')
        .populate('rentRenter');

        // סינון תמונות לפי המשכיר של ההשכרה
        const enrichedRents = rents.map(rent => {
            const accessoriesWithImage = rent.rentAccessories.map(accessory => {
                const matching = accessory.accessoryRenter.find(ar => 
                    ar.renter && ar.renter._id.toString() === renterId.toString()
                );
                return {
                    ...accessory.toObject(),
                    matchedImage: matching?.image || null
                };
            });

            return {
                ...rent.toObject(),
                rentAccessories: accessoriesWithImage
            };
        });

        res.status(200).send({ rents: enrichedRents });
    } catch (error) {
        console.error(error); 
        res.status(400).send(error.message);
    }
}

async function getOldRentsByRenter(req, res) {
    const { renterId } = req.params; 
    try {
        const now = new Date();
        const rents = await Rent.find({
            rentRenter: renterId,
            rentReturnDate: { $lte: now } // רק השכרות שתאריך ההחזרה שלהן כבר עבר
        })
        .populate('rentUser')
        .populate('rentAccessories')
        .populate('rentRenter');

        // סינון תמונות לפי המשכיר של ההשכרה
        const enrichedRents = rents.map(rent => {
            const accessoriesWithImage = rent.rentAccessories.map(accessory => {
                const matching = accessory.accessoryRenter.find(ar => 
                    ar.renter && ar.renter._id.toString() === renterId.toString()
                );
                return {
                    ...accessory.toObject(),
                    matchedImage: matching?.image || null
                };
            });

            return {
                ...rent.toObject(),
                rentAccessories: accessoriesWithImage
            };
        });

        res.status(200).send({ rents: enrichedRents });
    } catch (error) {
        console.error(error); 
        res.status(400).send(error.message);
    }
}


async function getRentsByUser(req, res) {
    const { userId } = req.params;
    try {
        const now = new Date();
        const rents = await Rent.find({
            rentUser: userId,
            rentReturnDate: { $gt: now } // רק השכרות שעדיין לא עברו את תאריך ההחזרה
        })
        .populate('rentUser')
        .populate('rentRenter')
        .populate({
            path: 'rentAccessories',
            populate: {
                path: 'accessoryRenter.renter',
                model: 'Renters'
            }
        });

        // סינון תמונות לפי המשכיר של ההשכרה
        const enrichedRents = rents.map(rent => {
            const accessoriesWithImage = rent.rentAccessories.map(accessory => {
                const matching = accessory.accessoryRenter.find(ar => 
                    ar.renter && ar.renter._id.toString() === rent.rentRenter._id.toString()
                );
                return {
                    ...accessory.toObject(),
                    matchedImage: matching?.image || null
                };
            });

            return {
                ...rent.toObject(),
                rentAccessories: accessoriesWithImage
            };
        });

        res.status(200).send({ rents: enrichedRents });
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
}

async function getOldRentsByUser(req, res) {
    const { userId } = req.params;
    try {
        const now = new Date();
        const rents = await Rent.find({
            rentUser: userId,
            rentReturnDate: { $lte: now }
        })
        .populate('rentUser')
        .populate('rentRenter')
        .populate({
            path: 'rentAccessories',
            populate: {
                path: 'accessoryRenter.renter',
                model: 'Renters'
            }
        });

        // סינון תמונות לפי המשכיר של ההשכרה
        const enrichedRents = rents.map(rent => {
            const accessoriesWithImage = rent.rentAccessories.map(accessory => {
                const matching = accessory.accessoryRenter.find(ar => 
                    ar.renter && ar.renter._id.toString() === rent.rentRenter._id.toString()
                );
                return {
                    ...accessory.toObject(),
                    matchedImage: matching?.image || null
                };
            });

            return {
                ...rent.toObject(),
                rentAccessories: accessoriesWithImage
            };
        });

        res.status(200).send({ rents: enrichedRents });
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
        // await Renter.updateOne(
        //     { renterRent: rentId },
        //     { $pull: { renterRents: rentId } }
        // );

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
    { accessoryRent: { $elemMatch: { renter: rent.rentRenter, date: rent.rentDate } } },
    { $pull: { accessoryRent: { renter: rent.rentRenter, date: rent.rentDate } } }
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

        // בדוק אם יש אביזרים בהשכרה
        if (!rent.rentAccessories || rent.rentAccessories.length === 0) {
            return res.status(404).send("אין אביזרים בהשכרה.");
        }

        // בדוק אם האביזר קיים בהשכרה
        console.log("Accessory ID:", accessoryId);
        console.log("Rent Accessories:", rent.rentAccessories);
        const accessoryIndex = rent.rentAccessories.findIndex(id => id.toString() === accessoryId.toString());
        if (accessoryIndex === -1) {
            return res.status(404).send("אביזר לא נמצא בהשכרה.");
        }

        // הסר את האביזר מהשכרה
        rent.rentAccessories.splice(accessoryIndex, 1);
        await rent.save();

        // עדכון היסטוריית השכרת האביזר
        const accessory = await Accessory.findById(accessoryId);
        if (!accessory) {
            return res.status(404).send("אביזר לא נמצא.");
        }

        accessory.accessoryRent = accessory.accessoryRent.filter(rent => 
            rent.renter.toString() !== renterId || new Date(rent.date).getTime() !== new Date(rentDate).getTime()
        );
        await accessory.save();

        // בדוק אם אין יותר אביזרים בהשכרה
        if (rent.rentAccessories.length === 0) {
            await deleteRent({ params: { rentId: rent._id } }, res);
            return; // עצור כאן כדי למנוע הודעה נוספת
        }

        res.status(200).send("אביזר נמחק בהצלחה מהשכרה.");
    } catch (error) {
        console.error("Error in removeAccessory:", error.message);
        res.status(400).send(error.message);
    }
}
async function checkOrCreateRent(req, res) {
    try {
        const { rentDate, renterId, accessoryId, userId } = req.body;

        // בדוק אם יש השכרה קיימת בתאריך זה עבור אותו לקוח ואותו משכיר
        const existingRent = await Rent.findOne({
            rentDate: new Date(rentDate),
            rentRenter: renterId,
            rentUser: userId, // הוסף את userId לבדיקה
        });
       const accessory=await Accessory.findById(accessoryId);
        const renter = accessory.accessoryRenter.find(r => r.renter.toString() === renterId.toString());
        const accessoryPrice = renter.price;

        console.log("Accessory Price:", accessoryPrice); // הדפסת מחיר האביזר
        if (existingRent) {
            if (!existingRent.rentAccessories.includes(accessoryId)) {
                existingRent.rentAccessories.push(accessoryId); // הוסף את האביזר להשכרה
                existingRent.rentPrice += accessoryPrice; // עדכן את המחיר של ההשכרה
                await existingRent.save();
                return res.status(200).send({ message: "Accessory added to existing rent" });
            } else {
                return res.status(200).send({ message: "Accessory already exists in the rent" });
            }
        }

        // אם אין השכרה, צור השכרה חדשה
        const newRent = new Rent({
            rentDate: new Date(rentDate),
            rentRenter: renterId,
            rentUser: userId, // הוסף את userId להשכרה החדשה
            rentAccessories: [accessoryId],
            rentPrice:accessoryPrice, // הנחה שהאביזר הוא אובייקט עם מחיר
            rentReturnDate: new Date(new Date(rentDate).setDate(new Date(rentDate).getDate() + 1)), // הוסף יום אחד לתאריך השכרה
        });
        await newRent.save();

        accessory.accessoryRent.push({ 
            date: rentDate, 
            returnDate: newRent.rentReturnDate, 
            renter: renterId 
        });
        await accessory.save();
        return res.status(201).send({ message: "New rent created" });
    } catch (error) {
        console.error("Error checking or creating rent:", error);
        res.status(500).send(error.message);
    }
}

module.exports={ deleteRent,createRent,addAccessory,getAllRents,getOldRentsByUser, getOldRentsByRenter,updateRent,removeAccessory,getRentsByRenter,getRentsByUser,checkOrCreateRent}