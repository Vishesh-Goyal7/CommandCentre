const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/eventsController');

router.use(auth);

router.post('/', createEvent);         
router.get('/', getEvents);            
router.put('/:id', updateEvent);       
router.delete('/:id', deleteEvent);    

module.exports = router;
