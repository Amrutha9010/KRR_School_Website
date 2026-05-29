const express = require('express');
const router = express.Router();
const { 
  getHostelRooms, 
  getHostelStats, 
  assignStudentToRoom 
} = require('../controllers/hostelController');

router.get('/test', (req, res) => { 
  res.json({ message: 'Hostel route working' }); 
});
router.get('/rooms', getHostelRooms);
router.get('/stats', getHostelStats);
router.post('/assign', assignStudentToRoom);
router.get('/availability', getHostelStats);

module.exports = router;
