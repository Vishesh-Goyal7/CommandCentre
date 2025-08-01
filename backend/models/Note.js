const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image'], default: 'text' }
}, { timestamps: true }); 

module.exports = mongoose.model('Note', NoteSchema);