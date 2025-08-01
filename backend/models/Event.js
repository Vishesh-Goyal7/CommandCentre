const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brief: { type: String, default: '' },
  dateTime: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);