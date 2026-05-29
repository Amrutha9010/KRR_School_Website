const Razorpay = require('razorpay');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');

const HostelPayment = require('../models/HostelPayment');
const HostelApplication = require('../models/HostelApplication');
const HostelRoom = require('../models/HostelRoom');
const HostelStudent = require('../models/HostelStudent');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});



// ======================================================
// CREATE HOSTEL ORDER
// ======================================================

exports.createHostelOrder = async (req, res) => {

  try {

    const { applicationId } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        success: false,
        error: 'Application ID is required'
      });
    }

    const application = await HostelApplication.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    if (application.paymentStatus === 'Completed') {
      return res.status(400).json({
        success: false,
        error: 'Payment already completed'
      });
    }

    // ===============================
    // FEES
    // ===============================

    const admissionFee = 5000;
    const securityDeposit = 10000;
    const hostelFee =
      application.roomType === 'AC'
        ? 75000
        : 55000;

    const totalAmount =
      hostelFee +
      admissionFee +
      securityDeposit;

    // ===============================
    // CREATE ORDER
    // ===============================

    const options = {
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // ===============================
    // SAVE PAYMENT
    // ===============================

    await HostelPayment.create({
      applicationId: application._id,
      studentName: application.studentName,
      orderId: order.id,
      amount: totalAmount,

      feeBreakdown: {
        hostelFee,
        admissionFee,
        securityDeposit
      }
    });

    return res.status(200).json({
      success: true,

      orderId: order.id,
      amount: order.amount,
      currency: order.currency,

      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};



// ======================================================
// VERIFY HOSTEL PAYMENT
// ======================================================

exports.verifyHostelPayment = async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // ===============================
    // VALIDATION
    // ===============================

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment credentials'
      });
    }

    // ===============================
    // VERIFY SIGNATURE
    // ===============================

    const generated_signature = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id +
        "|" +
        razorpay_payment_id
      )
      .digest('hex');

    if (
      generated_signature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }

    // ===============================
    // FIND PAYMENT
    // ===============================

    const payment =
      await HostelPayment.findOneAndUpdate(

        {
          orderId: razorpay_order_id
        },

        {
          paymentId: razorpay_payment_id,
          signature: razorpay_signature,
          status: 'Captured',
          paidAt: new Date()
        },

        {
          returnDocument: 'after'
        }
      );

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment record not found'
      });
    }

    // ===============================
    // GET APPLICATION (but don't update yet)
    // ===============================

    const application = await HostelApplication.findById(payment.applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // ===============================
    // CHECK IF ALREADY COMPLETED
    // ===============================

    const existingStudent =
      await HostelStudent.findOne({
        studentId: application.studentId
      });

    if (existingStudent) {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified and receipt generated',
        data: {
          paymentId: razorpay_payment_id,
          roomNumber: existingStudent.hostelDetails.roomNumber,
          receiptUrl: `http://localhost:5000/api/hostel-payments/receipt/${razorpay_payment_id}`
        }
      });
    }

    // ===============================
    // SUCCESS RESPONSE (payment verified, waiting for receipt download)
    // ===============================

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully. Please download the receipt to complete the process.',
      data: {
        paymentId: razorpay_payment_id,
        studentName: application.studentName,
        studentId: application.studentId,
        receiptUrl: `http://localhost:5000/api/hostel-payments/receipt/${razorpay_payment_id}`
      }
    });

  } catch (err) {

    console.error(
      'HOSTEL VERIFY ERROR:',
      err
    );

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};



// ======================================================
// PAYMENT HISTORY
// ======================================================

exports.getPaymentHistory = async (req, res) => {

  try {

    const payments =
      await HostelPayment.find()
        .sort({ createdAt: -1 });

    return res.status(200).json({

      success: true,

      count: payments.length,

      data: payments
    });

  } catch (err) {

    return res.status(500).json({

      success: false,

      error: err.message
    });
  }
};



// ======================================================
// DOWNLOAD RECEIPT PDF
// ======================================================

exports.getAdmissionReceipt = async (req, res) => {
  try {
    const payment = await HostelPayment.findOne({
      paymentId: req.params.paymentId
    }).populate('applicationId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Receipt not found'
      });
    }

    // Check if receipt was already generated and process completed
    if (payment.receiptGenerated && payment.status === 'Completed') {
      // Just generate and send the PDF again without reprocessing
      return generateAndSendPDF(payment, res);
    }

    // ===============================
    // 1. FIRST GENERATE PDF INTO A BUFFER TO VERIFY SUCCESS
    // ===============================
    const pdfBuffer = await generatePDFBuffer(payment);

    // ===============================
    // 2. NOW PERFORM THE FINAL STEPS (since PDF generation was successful)
    // ===============================
    const application = payment.applicationId;

    // Check if student already exists to avoid duplicates
    let existingStudent = await HostelStudent.findOne({
      studentId: application.studentId
    });

    let allocatedRoom = 'Pending';

    if (!existingStudent) {
      // Find and allocate room
      const room = await HostelRoom.findOne({
        hostelType: application.hostelType,
        roomType: application.roomType,
        availableBeds: { $gt: 0 }
      });

      if (room) {
        allocatedRoom = room.roomNumber;

        // Create HostelStudent
        existingStudent = await HostelStudent.create({
          studentId: application.studentId,
          studentName: application.studentName,
          gender: application.gender,
          dateOfBirth: application.dateOfBirth,
          studentClass: application.studentClass,
          bloodGroup: application.bloodGroup,
          aadhaarNumber: application.aadhaarNumber,
          parentDetails: {
            fatherName: application.fatherName,
            motherName: application.motherName,
            mobile: application.mobileNumber,
            email: application.email,
            address: application.address
          },
          hostelDetails: {
            room: room._id,
            roomNumber: room.roomNumber,
            hostelType: room.hostelType,
            roomType: room.roomType,
            admissionDate: new Date()
          }
        });

        // Update room
        room.studentsAssigned.push(existingStudent._id);
        room.occupiedBeds += 1;
        room.availableBeds = room.totalBeds - room.occupiedBeds;
        await room.save();
      }

      // Update application status
      await HostelApplication.findByIdAndUpdate(
        application._id,
        {
          paymentStatus: 'Completed',
          applicationStatus: 'Approved',
          roomNumber: allocatedRoom
        }
      );
    }

    // Update payment status to Completed and mark receipt as generated
    await HostelPayment.findByIdAndUpdate(
      payment._id,
      {
        status: 'Completed',
        receiptGenerated: true,
        receiptDownloadedAt: new Date()
      }
    );

    // ===============================
    // 3. SEND THE GENERATED PDF
    // ===============================
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Hostel_Receipt_${payment.paymentId}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (err) {
    console.error('PDF RECEIPT ERROR:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

// Helper function to generate PDF buffer
function generatePDFBuffer(payment) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const doc = new PDFDocument({
      margin: 40,
      size: 'A4'
    });

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // ===============================
    // HEADER
    // ===============================
    doc.rect(0, 0, 700, 100).fill('#0f172a');

    doc.fillColor('#ffffff')
      .fontSize(26)
      .font('Helvetica-Bold')
      .text('KRR BRIGHTMINDS SCHOOL', 50, 35);

    doc.fontSize(12)
      .font('Helvetica')
      .text('HOSTEL PAYMENT RECEIPT', 50, 70);

    // ===============================
    // DETAILS
    // ===============================
    let y = 140;
    doc.fillColor('#000000');

    const details = [
      ['Student Name', payment.studentName],
      ['Student ID', payment.applicationId.studentId],
      ['Hostel Type', payment.applicationId.hostelType],
      ['Room Type', payment.applicationId.roomType],
      ['Payment ID', payment.paymentId],
      ['Payment Status', payment.status],
      ['Date', new Date(payment.paidAt).toLocaleDateString('en-IN')]
    ];

    details.forEach(item => {
      doc.font('Helvetica-Bold')
        .fontSize(12)
        .text(item[0], 50, y);
      doc.font('Helvetica')
        .text(': ' + item[1], 220, y);
      y += 28;
    });

    // ===============================
    // FEES
    // ===============================
    y += 20;
    doc.font('Helvetica-Bold')
      .fontSize(16)
      .text('Fee Breakdown', 50, y);
    y += 40;

    const fees = [
      ['Hostel Fee', payment.feeBreakdown.hostelFee],
      ['Admission Fee', payment.feeBreakdown.admissionFee],
      ['Security Deposit', payment.feeBreakdown.securityDeposit]
    ];

    fees.forEach(fee => {
      doc.font('Helvetica')
        .fontSize(12)
        .text(fee[0], 60, y);
      doc.text(`₹ ${fee[1].toLocaleString('en-IN')}`, 420, y);
      y += 28;
    });

    // ===============================
    // TOTAL
    // ===============================
    y += 20;
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 20;
    doc.font('Helvetica-Bold')
      .fontSize(16)
      .text('TOTAL PAID', 60, y);
    doc.text(`₹ ${payment.amount.toLocaleString('en-IN')}`, 400, y);

    // ===============================
    // FOOTER
    // ===============================
    y += 80;
    doc.font('Helvetica')
      .fontSize(10)
      .fillColor('gray')
      .text('This is a computer generated receipt.', 50, y);
    doc.text('KRR BrightMinds School | Hostel Department', 50, y + 18);

    doc.end();
  });
}

// Helper function to just send PDF when receipt is already generated
function generateAndSendPDF(payment, res) {
  return new Promise((resolve, reject) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Hostel_Receipt_${payment.paymentId}.pdf`);

    const doc = new PDFDocument({
      margin: 40,
      size: 'A4'
    });

    doc.pipe(res);

    // ===============================
    // HEADER
    // ===============================
    doc.rect(0, 0, 700, 100).fill('#0f172a');

    doc.fillColor('#ffffff')
      .fontSize(26)
      .font('Helvetica-Bold')
      .text('KRR BRIGHTMINDS SCHOOL', 50, 35);

    doc.fontSize(12)
      .font('Helvetica')
      .text('HOSTEL PAYMENT RECEIPT', 50, 70);

    // ===============================
    // DETAILS
    // ===============================
    let y = 140;
    doc.fillColor('#000000');

    const details = [
      ['Student Name', payment.studentName],
      ['Student ID', payment.applicationId.studentId],
      ['Hostel Type', payment.applicationId.hostelType],
      ['Room Type', payment.applicationId.roomType],
      ['Payment ID', payment.paymentId],
      ['Payment Status', payment.status],
      ['Date', new Date(payment.paidAt).toLocaleDateString('en-IN')]
    ];

    details.forEach(item => {
      doc.font('Helvetica-Bold')
        .fontSize(12)
        .text(item[0], 50, y);
      doc.font('Helvetica')
        .text(': ' + item[1], 220, y);
      y += 28;
    });

    // ===============================
    // FEES
    // ===============================
    y += 20;
    doc.font('Helvetica-Bold')
      .fontSize(16)
      .text('Fee Breakdown', 50, y);
    y += 40;

    const fees = [
      ['Hostel Fee', payment.feeBreakdown.hostelFee],
      ['Admission Fee', payment.feeBreakdown.admissionFee],
      ['Security Deposit', payment.feeBreakdown.securityDeposit]
    ];

    fees.forEach(fee => {
      doc.font('Helvetica')
        .fontSize(12)
        .text(fee[0], 60, y);
      doc.text(`₹ ${fee[1].toLocaleString('en-IN')}`, 420, y);
      y += 28;
    });

    // ===============================
    // TOTAL
    // ===============================
    y += 20;
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 20;
    doc.font('Helvetica-Bold')
      .fontSize(16)
      .text('TOTAL PAID', 60, y);
    doc.text(`₹ ${payment.amount.toLocaleString('en-IN')}`, 400, y);

    // ===============================
    // FOOTER
    // ===============================
    y += 80;
    doc.font('Helvetica')
      .fontSize(10)
      .fillColor('gray')
      .text('This is a computer generated receipt.', 50, y);
    doc.text('KRR BrightMinds School | Hostel Department', 50, y + 18);

    doc.end();
    resolve();
  });
}