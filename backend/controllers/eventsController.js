const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const { title, brief, dateTime } = req.body;
    const event = new Event({ title, brief, dateTime });
    await event.save();
    res.status(201).json({ msg: 'Event created', event });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ dateTime: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, brief, dateTime } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, brief, dateTime },
      { new: true }
    );

    if (!updatedEvent) return res.status(404).json({ msg: 'Event not found' });

    res.json({ msg: 'Event updated', updatedEvent });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ msg: 'Event not found' });

    res.json({ msg: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};