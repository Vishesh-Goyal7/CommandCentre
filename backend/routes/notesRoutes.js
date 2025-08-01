const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  createNote,
  getNotes,
  updateNote,
  deleteNote
} = require('../controllers/notesController');

router.use(auth);

router.post('/', upload.single('image'), createNote);
router.get('/', getNotes);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;