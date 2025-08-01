const Note = require('../models/Note');
const s3 = require('../config/s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

exports.createNote = async (req, res) => {
  try {
    const { title, type } = req.body;
    let content = req.body.content;

    if (type === 'image') {
      if (!req.file || !req.file.location) {
        return res.status(400).json({ msg: 'Image file is missing or failed to upload' });
      }
      content = req.file.location;
    }

    const note = new Note({ title, content, type });
    await note.save();
    res.status(201).json({ msg: 'Note created', note });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, type, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ msg: 'Note not found' });

    res.json({ msg: 'Note updated', updatedNote });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) return res.status(404).json({ msg: 'Note not found' });

    if (note.type === 'image' && note.content) {
      const url = new URL(note.content);
      const key = decodeURIComponent(url.pathname.substring(1));

      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
      });

      await s3.send(command);
    }

    await note.deleteOne();
    res.json({ msg: 'Note and image (if applicable) deleted' });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};