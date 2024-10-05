const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2'); 

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3, 
    maxlength: 20 
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 3, 
    maxlength: 20 
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 50 
  },
  isFavourite: {
    type: Boolean,
    default: false,
  },
  contactType: {
    type: String,
    enum: ['work', 'home', 'personal'],
    default: 'personal',
  },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { 
  timestamps: true,
  versionKey: false  
});


contactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Contact', contactSchema);


