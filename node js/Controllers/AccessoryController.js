const _ = require('lodash');

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

    try {
        const activeRentals = await Rent.findOne({
            rentUser: renterid,
            rentAccessories: accessoryid,
            rentReturnDate: { $exists: false } 
        });

        if (activeRentals) {
            return res.status(400).send("Cannot delete the accessory while it is still rented.");
        }

        await Renters.updateOne(
            { _id: renterid },
            { $pull: { renterAccessory: { accessory: accessoryid } } }
        );
        await Accessory.updateOne(
            { _id: accessoryid },
            { $pull: { renters: renterid } } 
        );

        const renterCount = await Renters.countDocuments({ 'renterAccessory.accessory': accessoryid });

        if (renterCount === 0) {
           
            await Accessory.findByIdAndDelete(accessoryid);
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
}




module.exports={createAccessory,deleteAccessory,getAccessoryByGallery,updateAccessory,deleteAccessoryFromRenter,getAccessoryRentersDetails,getAllAccessory}