const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const dns = require('dns');

// Fix for querySrv ECONNREFUSED by setting DNS servers manually
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  });

// Routes
const feeRoutes = require('./routes/feeRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transportRoutes = require('./routes/transportRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const hostelApplicationRoutes = require('./routes/hostelApplicationRoutes');
const hostelPaymentRoutes = require('./routes/hostelPaymentRoutes');

app.use('/api/fees', feeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/hostel-applications', hostelApplicationRoutes);
app.use('/api/hostel-payments', hostelPaymentRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('KRR BrightMinds School API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
