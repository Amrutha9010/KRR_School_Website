const { Bus, Route, PickupPoint, TransportAssignment, TransportPayment } = require('../models/Transport');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Haversine formula to calculate distance between two points in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// @desc    Get all transport data for dashboard
// @route   GET /api/transport/dashboard
exports.getTransportDashboard = async (req, res) => {
  try {
    const buses = await Bus.find();
    const routes = await Route.find().populate('bus');
    const pickupPoints = await PickupPoint.find().populate('route');
    const assignments = await TransportAssignment.find();

    const stats = {
      totalBuses: buses.length,
      activeRoutes: routes.length,
      availableSeats: buses.reduce((acc, bus) => acc + (bus.availableSeats || 0), 0),
      totalPickupPoints: pickupPoints.length,
      studentsUsingTransport: assignments.length
    };

    res.status(200).json({
      success: true,
      stats,
      buses,
      routes,
      pickupPoints
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Find nearest transport options
// @route   POST /api/transport/find-nearest
exports.findNearestTransport = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Coordinates are required' });
    }

    const pickupPoints = await PickupPoint.find().populate({
      path: 'route',
      populate: { path: 'bus' }
    });

    if (pickupPoints.length === 0) {
      return res.status(404).json({ success: false, message: 'No pickup points found' });
    }

    let nearestPoint = null;
    let minDistance = Infinity;

    pickupPoints.forEach(point => {
      const distance = getDistance(lat, lng, point.location.lat, point.location.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = point;
      }
    });

    // School location: KRR BrightMinds School, Tadikalapudi
    const schoolLocation = { lat: 16.816, lng: 81.233 };
    const distanceToSchool = getDistance(lat, lng, schoolLocation.lat, schoolLocation.lng);

    res.status(200).json({
      success: true,
      nearestPoint,
      distanceFromSearch: minDistance,
      distanceToSchool,
      estimatedTime: Math.round(minDistance * 5 + 10)
    });
  } catch (error) {
    console.error('Find nearest error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register student for transport
// @route   POST /api/transport/register
exports.registerTransport = async (req, res) => {
  try {
    const { 
      studentName, 
      studentId,
      studentRollNo, 
      studentClass, 
      studentPhone, 
      address,
      location, 
      pickupPointId, 
      routeId, 
      busId 
    } = req.body;

    let existingAssignment = await TransportAssignment.findOne({ studentId });
    const route = await Route.findById(routeId);
    
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });

    if (existingAssignment) {
      if (existingAssignment.assignmentStatus === 'pending') {
        existingAssignment.studentName = studentName;
        existingAssignment.studentRollNo = studentRollNo;
        existingAssignment.studentClass = studentClass;
        existingAssignment.studentPhone = studentPhone;
        existingAssignment.address = address;
        existingAssignment.location = location;
        existingAssignment.pickupPoint = pickupPointId;
        existingAssignment.route = routeId;
        existingAssignment.bus = busId;
        existingAssignment.fee = route.fee;
        existingAssignment.dueAmount = route.fee - existingAssignment.paidAmount;
        await existingAssignment.save();
        return res.status(200).json({ success: true, data: existingAssignment });
      } else {
        return res.status(400).json({ success: false, message: 'Active transport assignment already exists' });
      }
    }

    const assignment = await TransportAssignment.create({
      studentName,
      studentId,
      studentRollNo,
      studentClass,
      studentPhone,
      address,
      location,
      pickupPoint: pickupPointId,
      route: routeId,
      bus: busId,
      fee: route.fee,
      dueAmount: route.fee,
      assignmentStatus: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Razorpay Order
// @route   POST /api/transport/create-order
exports.createTransportOrder = async (req, res) => {
  try {
    const { assignmentId, amount } = req.body;
    const assignment = await TransportAssignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${assignment.studentId}_${Date.now()}`
    });

    await TransportPayment.create({
      studentId: assignment.studentId,
      assignment: assignment._id,
      amount,
      razorpayOrderId: order.id,
      status: 'created'
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/transport/verify-payment
exports.verifyTransportPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, assignmentId } = req.body;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const payment = await TransportPayment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: 'captured' },
        { new: true }
      );

      const assignment = await TransportAssignment.findById(assignmentId);
      assignment.paidAmount += payment.amount;
      assignment.dueAmount = assignment.fee - assignment.paidAmount;
      assignment.paymentStatus = assignment.dueAmount <= 0 ? 'paid' : 'partial';
      assignment.assignmentStatus = 'active';
      await assignment.save();

      const bus = await Bus.findById(assignment.bus);
      if (bus && bus.availableSeats > 0) {
        bus.availableSeats -= 1;
        await bus.save();
      }

      res.status(200).json({ 
        success: true, 
        message: "Payment verified", 
        assignment,
        paymentId: payment._id 
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate Transport Receipt PDF
// @route   GET /api/transport/receipt/:paymentId
exports.getTransportReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Find payment and populate related data
    const payment = await TransportPayment.findById(paymentId).populate({
      path: 'assignment',
      populate: [
        { path: 'route', populate: 'bus' },
        { path: 'pickupPoint' }
      ]
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    const { assignment } = payment;
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=KRR_Transport_Receipt_${assignment.studentId}.pdf`);

    doc.pipe(res);

    // --- PDF Header ---
    doc.rect(0, 0, 600, 100).fill('#3b82f6');
    doc.fillColor('#ffffff')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('KRR BRIGHTMINDS SCHOOL', 50, 35);
    doc.fontSize(10)
       .font('Helvetica')
       .text('Smart Transport Department | Academic Year 2026-27', 50, 65);

    // --- Receipt Info ---
    doc.fillColor('#4b5563').fontSize(12).text('PAYMENT RECEIPT', 400, 120, { align: 'right' });
    doc.fontSize(10).text(`Receipt No: RCPT-${payment._id.toString().slice(-6).toUpperCase()}`, 400, 140, { align: 'right' });
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 400, 155, { align: 'right' });

    // --- Student Details Card ---
    doc.rect(50, 180, 500, 100).fill('#f9fafb');
    doc.fillColor('#1f2937').fontSize(12).font('Helvetica-Bold').text('STUDENT INFORMATION', 65, 195);
    
    doc.fontSize(10).font('Helvetica').fillColor('#4b5563');
    doc.text(`Name: ${assignment.studentName}`, 65, 215);
    doc.text(`Student ID: ${assignment.studentId}`, 65, 230);
    doc.text(`Class: ${assignment.studentClass}`, 65, 245);
    
    doc.text(`Phone: ${assignment.studentPhone}`, 300, 215);
    doc.text(`Roll No: ${assignment.studentRollNo || 'N/A'}`, 300, 230);

    // --- Transport Details Card ---
    doc.rect(50, 300, 500, 120).fill('#f0f9ff');
    doc.fillColor('#0369a1').fontSize(12).font('Helvetica-Bold').text('TRANSPORT DETAILS', 65, 315);
    
    doc.fontSize(10).font('Helvetica').fillColor('#0e7490');
    doc.text(`Assigned Route: ${assignment.route.routeName}`, 65, 335);
    doc.text(`Bus Number: ${assignment.route.bus.busNumber}`, 65, 350);
    doc.text(`Pickup Point: ${assignment.pickupPoint.name}`, 65, 365);
    doc.text(`Pickup Timing: ${assignment.route.timing.pickup}`, 65, 380);
    
    doc.text(`Driver: ${assignment.route.bus.driverName}`, 300, 335);
    doc.text(`Driver Contact: ${assignment.route.bus.driverContact}`, 300, 350);

    // --- Payment Table ---
    doc.rect(50, 440, 500, 30).fill('#3b82f6');
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold');
    doc.text('DESCRIPTION', 65, 450);
    doc.text('AMOUNT', 450, 450, { align: 'right' });

    doc.fillColor('#1f2937').font('Helvetica');
    doc.text('Annual Transport Fee', 65, 485);
    doc.text(`INR ${assignment.fee.toLocaleString()}`, 450, 485, { align: 'right' });
    
    doc.rect(50, 510, 500, 1).fill('#e5e7eb');
    
    doc.font('Helvetica-Bold').text('Total Paid', 65, 530);
    doc.text(`INR ${payment.amount.toLocaleString()}`, 450, 530, { align: 'right' });

    // --- Status Badge ---
    doc.rect(400, 560, 150, 40).fill('#dcfce7');
    doc.fillColor('#166534').fontSize(14).font('Helvetica-Bold').text('PAID', 400, 572, { width: 150, align: 'center' });

    // --- Footer ---
    doc.rect(0, 750, 600, 100).fill('#f3f4f6');
    doc.fillColor('#9ca3af').fontSize(8).font('Helvetica').text('This is a computer generated receipt. No signature required.', 0, 770, { align: 'center' });
    doc.text('KRR BrightMinds School Transport Department', 0, 785, { align: 'center' });
    doc.text('Tadikalapudi, Andhra Pradesh', 0, 800, { align: 'center' });

    doc.end();

  } catch (error) {
    console.error('Receipt generation error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate receipt' });
  }
};

// Legacy assignTransport for compatibility
exports.assignTransport = async (req, res) => {
  try {
    const { studentName, studentId, studentRollNo, studentClass, studentPhone, location, pickupPointId, routeId, busId } = req.body;
    const bus = await Bus.findById(busId);
    if (!bus || bus.availableSeats <= 0) return res.status(400).json({ success: false, message: 'No seats available' });

    const assignment = await TransportAssignment.create({
      studentName,
      studentId: studentId || `STU${Date.now()}`,
      studentRollNo, studentClass, studentPhone, location,
      pickupPoint: pickupPointId, route: routeId, bus: busId, assignmentStatus: 'active'
    });

    bus.availableSeats -= 1;
    await bus.save();
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
