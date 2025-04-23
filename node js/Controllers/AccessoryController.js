const _ = require('lodash');
const mongoose = require('mongoose');
const Accessory=require("../Modules/AccessoryModule")
const Renters = require("../Modules/RenterModule");
const Rent=require("../Modules/RentModule");

async function createAccessory(req, res)  {
    try {
        const accessory = new Accessory(req.body);
        
        await accessory.save();
        res.status(201).send({accessory:accessory});
    } catch (error) {
        res.status(400).send(error.message);
    }
}
async function deleteAccessory(req, res) {
    try {
        let { id } = req.params;
        
        // בדוק אם האביזר מושכר
        let rents = await Rent.find({ rentAccessories: id });
        if (rents.length > 0) {
            return res.status(400).send({ message: "Cannot delete accessory because it is currently rented." });
        }

        // מחק את האביזר אם הוא לא מושכר
        let accessory = await Accessory.findByIdAndDelete(id);
        if (!accessory) {
            return res.status(404).send(null);
        }

        await Renters.updateMany(
            { 'renterAccessory.accessory': id },
            { $pull: { renterAccessory: { accessory: id } } }
        );

        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function getAllAccessory(req, res)  {
    try {
        let accessory = await Accessory.find();
         res.status(200).send(accessory);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
async function getAccessoryByGallery(req,res){
    try {
        const {gallery} = req.params;
        let accessory= await Accessory.find({accessoryGallery:gallery})
        if (!accessory) {
           res.status(404).send(null);
        }
        else res.status(200).send(accessory);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
async function getAccessoryByRenter(req, res) {
    try {
        const { renterId } = req.params;

        const renterObjectId =new  mongoose.Types.ObjectId(renterId);

        const accessories = await Accessory.find({
            'accessoryRenter.renter': renterObjectId
        });

        if (!accessories || accessories.length === 0) {
            return res.status(404).send("No accessories found for this renter.");
        }

       
        const filteredAccessories = accessories.map(accessory => {
            const renterInfo = accessory.accessoryRenter.find(renter =>
                renter.renter.equals(renterObjectId)
            );

            return {
                accessoryName: accessory.accessoryName,
                accessoryId: accessory._id,
                price: renterInfo?.price || null,
                image: renterInfo?.image ? `/uploads/${renterInfo.image.replace(/^uploads[\\/]/, '')}` : null
            };
        });

        res.status(200).send(filteredAccessories);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function getAccessoryRentersDetails(req, res) {
    try {
        const { accessoryId } = req.params; 
        const accessory = await Accessory.findById(accessoryId).populate('accessoryRenter.renter'); 

        if (!accessory) {
            return res.status(404).send(null); 
        } else {
            const rentersDetails = accessory.accessoryRenter.map(r => ({
                name: r.renter.renterName,
                address: r.renter.renterAddress,
                prices: r.renter.renterAccessory.map(a => a.price) 
            }));
            return res.status(200).send(rentersDetails);
        }
    } catch (error) {
        return res.status(500).send(error.message); 
    }
}


async function updateAccessory(req, res) {
    try {
        let { id } = req.params;
        let accessory = await Accessory.findById(id);
        if (!accessory) {
            return res.status(404).send(null);
        }
        _.assign(accessory, req.body);
        await accessory.save(); 
        res.status(200).send(accessory);
    } catch (error) {
        res.status(500).send(error.message);
    }
}
async function deleteAccessoryFromRenter(req, res) {
    let { renterid } = req.params;
    let accessoryid = req.body.accessoryid;
    console.log("Renter ID:", renterid);
    console.log("Accessory ID:", accessoryid);
    
    try {
        const renter = await Renters.findOne({ _id: new mongoose.Types.ObjectId(renterid), 'renterAccessory.accessory': new mongoose.Types.ObjectId(accessoryid) });
        console.log("Renter found:", renter);
        console.log("Checking for active rentals...");
        const activeRentals = await Rent.findOne({
            rentUser: renterid,
            rentAccessories: accessoryid,
            rentReturnDate: { $exists: false } 
        });

        console.log("Active Rentals Found:", activeRentals);

        if (activeRentals) {
            return res.status(400).send("Cannot delete the accessory while it is still rented.");
        }

        console.log("Updating Renters...");
        const updateResult = await Renters.updateOne(
            { _id: renterid, 'renterAccessory.accessory': new mongoose.Types.ObjectId(accessoryid) },
            { $pull: { renterAccessory: { accessory: new mongoose.Types.ObjectId(accessoryid) } } }
        );
        console.log("Renters Update Result:", updateResult);

        console.log("Updating Accessory...");
        await Accessory.updateOne(
            { _id: new mongoose.Types.ObjectId(accessoryid) },
            { $pull: { renters: renterid } } 
        );

        console.log("Counting renters for accessory...");
        const renterCount = await Renters.countDocuments({ 'renterAccessory.accessory': new mongoose.Types.ObjectId(accessoryid) });
        console.log("Renter Count:", renterCount);

        if (renterCount === 0) {
            console.log("No more renters for accessory, deleting...");
            await Accessory.findByIdAndDelete(new mongoose.Types.ObjectId(accessoryid));
        }

        console.log("Sending response with status 204");
        res.status(204).send();
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send(error.message);
    }
}


module.exports={createAccessory,getAccessoryByRenter,deleteAccessory,getAccessoryByGallery,updateAccessory,deleteAccessoryFromRenter,getAccessoryRentersDetails,getAllAccessory}