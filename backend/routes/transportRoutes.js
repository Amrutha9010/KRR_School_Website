const express = require('express');
const router = express.Router();
const {
  getTransportDashboard,
  findNearestTransport,
  assignTransport,
  registerTransport,
  createTransportOrder,
  verifyTransportPayment,
  getTransportReceipt
} = require('../controllers/transportController');

router.get('/dashboard', getTransportDashboard);
router.post('/find-nearest', findNearestTransport);
router.post('/assign', assignTransport);
router.post('/register', registerTransport);
router.post('/create-order', createTransportOrder);
router.post('/verify-payment', verifyTransportPayment);
router.get('/receipt/:paymentId', getTransportReceipt);

module.exports = router;
