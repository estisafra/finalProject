const mongoose = require("mongoose");

const renterModule = mongoose.Schema({
    renterPassword: { type: String, required: true }, 
    renterName: { type: String, required: true },
    renterAddress: { type: String },
    renterMail: { 
        type: String, 
        required: true, 
        match: /.+\@.+\..+/ 
    },
    renterPhone: { 
        type: String,
        match: /^\+?[0-9]{10,15}$/ 
    },
    renterAccessory: [{
        accessory: { type: mongoose.Schema.Types.ObjectId, ref: 'Accessories' },
        price: { type: Number }
    }],
});

module.exports = mongoose.model("Renters", renterModule);
