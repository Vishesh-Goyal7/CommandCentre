const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  problemStatement: { type: String, required: true },
  team: { type: String, required: true },
  statusUpdate: { type: [String], default: [] },
  nextDeadline: { type: Date, required: true },
  priority: {
    type: String,
    enum: ['Very High', 'High', 'Mid', 'Low', 'Very Low'],
    default: 'Mid'
  },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);