const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  course: {
    type: String
  },

  certificateId: {
    type: String,
    required: true,
    unique: true
  },

  issueDate: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Certificate", certificateSchema);