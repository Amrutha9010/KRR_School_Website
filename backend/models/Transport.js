const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  driverName: { type: String, required: true },
  driverContact: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

const RouteSchema = new mongoose.Schema({
  routeName: { type: String, required: true },
  routeNumber: { type: String, required: true, unique: true },
  path: [{
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }],
  villagesCovered: [String],
  timing: {
    pickup: { type: String, required: true },
    drop: { type: String, required: true }
  },
  fee: { type: Number, required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' }
}, { timestamps: true });

const PickupPointSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' }
}, { timestamps: true });

const TransportAssignmentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  studentRollNo: { type: String },
  studentClass: { type: String, required: true },
  studentPhone: { type: String, required: true },
  address: { type: String },
  location: {
    name: { type: String },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  pickupPoint: { type: mongoose.Schema.Types.ObjectId, ref: 'PickupPoint' },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  fee: { type: Number },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
  assignmentStatus: { type: String, enum: ['pending', 'active', 'cancelled'], default: 'pending' }
}, { timestamps: true });

const TransportPaymentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'TransportAssignment' },
  amount: { type: Number, required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ['created', 'captured', 'failed'], default: 'created' }
}, { timestamps: true });

const Bus = mongoose.model('Bus', BusSchema);
const Route = mongoose.model('Route', RouteSchema);
const PickupPoint = mongoose.model('PickupPoint', PickupPointSchema);
const TransportAssignment = mongoose.model('TransportAssignment', TransportAssignmentSchema);
const TransportPayment = mongoose.model('TransportPayment', TransportPaymentSchema);

module.exports = { Bus, Route, PickupPoint, TransportAssignment, TransportPayment };
