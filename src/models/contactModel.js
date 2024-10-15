const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); 

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Contact', contactSchema);



