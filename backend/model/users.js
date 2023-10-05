  const mongoose = require('mongoose')
  const userSchema = new mongoose.Schema({
      userid:{type: Number, required: true},
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: true },
      address:{type:String},
      
    });
  const Users = mongoose.model('User', userSchema);
  module.exports = Users;