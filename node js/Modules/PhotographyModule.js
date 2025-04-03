const mongoose = require("mongoose");

const PhotographyModule = mongoose.Schema({
    photographyPassword: { type: String, required: true },
    photographyName: { type: String, required: true },
    photographyAddress: { type: String, required: true },
    photographyMail: { 
        type: String, 
        required: true, 
        match: /.+\@.+\..+/ 
    },
    photographyPhone: { 
        type: String,
        match: /^\+?[0-9]{10,15}$/ 
    },
    photographyRank: { type: Number, min: 0, max: 10 },
    photographyImages: [{
        url: { type: String, required: true }, 
        galery: { type: String, required: true } 
    }],
    photographyGaleries: [{
        name: { type: String, required: true },
        minPrice: { type: Number, required: true },
        maxPrice: { type: Number, required: true }
    }],
    photographyOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }],
    photographyResponse: [{ type: String }], 
    photographyLink: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^(ftp|http|https):\/\/[^ "]+$/.test(v); 
            },
            message: props => `${props.value} הוא לא לינק חוקי!`
        }
    },
});

module.exports = mongoose.model("Photographies", PhotographyModule);
