const mongoose = require("mongoose");

const AccessoryModule= mongoose.Schema({
    accessoryName: { type: String },
    accessoryRenter:[{
        renter:{ type: mongoose.Schema.Types.ObjectId, ref: 'Renters'},
        image:{ type:String},
        price: { type: Number }
    }],
    accessoryGallery:{type:String},
    accessoryRent:[{
        date: { type:Date, required: true }, 
        renter:{ type: mongoose.Schema.Types.ObjectId, ref: 'Renters'}
    }],
   
});


module.exports = mongoose.model("Accessories",AccessoryModule);