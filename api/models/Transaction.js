const mongoose = require('mongoose');
const { Schema } = mongoose;

const TransactionSchema = new Schema({
    name: {type: String, required: true},
    price: {type: String, required: true},
    description: {type: String, required: true},
    datetime: {type: Date, required: true}
});

module.exports = mongoose.model('Transaction', TransactionSchema);