const mongoose = require("mongoose");

const OrderModule = mongoose.Schema({
orderDate:{type:Date ,required: true },
orderUser:{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
orderPhotography:{ type: mongoose.Schema.Types.ObjectId, ref: 'Photographies' }
});


module.exports = mongoose.model("Orders", OrderModule );