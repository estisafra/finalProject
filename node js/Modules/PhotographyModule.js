const mongoose = require("mongoose");

const PhotographyModule = mongoose.Schema({
    photographyPassword: { type: String, required: true },
    photographyName: { type: String, required: true },
    photographyAddress: { type: String, required: true },
    photographyMail: { 
        type: String, 
        required: true, 
    },
    photographyPhone: { 
        type: String,
    },
    photographyRank: { type: Number, min: 0, max: 10 },
    photographyGaleries: [{
        name: { type: String, required: true },
        minPrice: { type: Number, required: true },
        maxPrice: { type: Number, required: true },
       images:[{type: String, required: true}]
    }],
    photographyOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }],
    photographyResponse: [{ type: String }], 
    photographyLink: {
        type: String,
        required: true,
    },
    profile: { type: String } 
});

module.exports = mongoose.model("Photographies", PhotographyModule);
