const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const dns = require('dns');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Fix for querySrv ECONNREFUSED by setting DNS servers manually
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load env vars with absolute path
dotenv.config({ path: path.resolve(__dirname, '.env') });

// --- Environment variable validation
const requiredEnvVars = [
  'MONGO_URI',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'FRONTEND_URL'
];

console.log('🔍 Checking environment variables...');
console.log('Loaded env vars:', Object.keys(process.env).filter(key => 
  ['MONGO_URI', 'PORT', 'RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'FRONTEND_URL', 'BACKEND_URL'].includes(key)
));

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('FATAL ERROR: Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

console.log('✅ All required environment variables loaded successfully');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000'
    ],
    credentials: true
  }
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ],
  credentials: true
}));

// Import models for debug APIs and seeding
const HostelRoom = require('./models/HostelRoom');
const { Bus, Route, PickupPoint, TransportAssignment, TransportPayment } = require('./models/Transport');
const HostelPayment = require('./models/HostelPayment');

// --- Auto Seed Functions ---
const seedHostelRooms = async () => {
  try {
    const count = await HostelRoom.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding Hostel Rooms...');
      const rooms = [];

      // Boys Hostel - AC (5 rooms, 4 beds each)
      for (let i = 1; i <= 5; i++) {
        rooms.push({
          roomNumber: `B-AC-${i}`,
          hostelType: 'boys',
          roomType: 'ac',
          totalBeds: 4,
          occupiedBeds: 0,
          availableBeds: 4
        });
      }
      // Boys Hostel - Non-AC (5 rooms, 4 beds each)
      for (let i = 1; i <= 5; i++) {
        rooms.push({
          roomNumber: `B-NON-AC-${i}`,
          hostelType: 'boys',
          roomType: 'non-ac',
          totalBeds: 4,
          occupiedBeds: 0,
          availableBeds: 4
        });
      }

      // Girls Hostel - AC (5 rooms,4 beds each)
      for (let i = 1; i <=5; i++) {
        rooms.push({
          roomNumber: `G-AC-${i}`,
          hostelType: 'girls',
          roomType: 'ac',
          totalBeds: 4,
          occupiedBeds: 0,
          availableBeds:4
        });
      }
      // Girls Hostel - Non-AC (5 rooms,4 beds each)
      for (let i=1; i<=5; i++) {
        rooms.push({
          roomNumber: `G-NON-AC-${i}`,
          hostelType: 'girls',
          roomType: 'non-ac',
          totalBeds:4,
          occupiedBeds:0,
          availableBeds:4
        });
      }

      await HostelRoom.insertMany(rooms);
      console.log('✅ Hostel Rooms seeded successfully! (20 rooms, 4 beds each)');
    }
  } catch (err) {
    console.error('❌ Error seeding Hostel Rooms:', err.message);
  }
};

const seedTransportData = async () => {
  try {
    const busCount = await Bus.countDocuments();
    if (busCount === 0) {
      console.log('🌱 Seeding Transport Data...');
      const schoolLocation = { lat: 16.816, lng: 81.233 }; // Tadikalapudi
      
      // Helper to generate random coordinates near school
      const getRandomOffset = (max) => (Math.random() - 0.5) * max;

      const routeConfigs = [
        { name: 'Eluru Bypass', bus: 'BUS-104', fee: 9000, time: '50 mins', color: '#f87171' },
        { name: 'Vijayawada City', bus: 'BUS-105', fee: 12000, time: '90 mins', color: '#60a5fa' },
        { name: 'Nuzvid Town', bus: 'BUS-106', fee: 8000, time: '60 mins', color: '#34d399' },
        { name: 'Denduluru Junction', bus: 'BUS-107', fee: 7000, time: '40 mins', color: '#fbbf24' },
        { name: 'Kaikaluru Market', bus: 'BUS-108', fee: 11000, time: '75 mins', color: '#a78bfa' },
        { name: 'Gudivada Stand', bus: 'BUS-109', fee: 10000, time: '70 mins', color: '#f472b6' },
        { name: 'Tadikalapudi Local', bus: 'BUS-110', fee: 5000, time: '15 mins', color: '#fb7185' },
        { name: 'Kamavarapukota Town', bus: 'BUS-111', fee: 6000, time: '25 mins', color: '#2dd4bf' },
        { name: 'Jangareddygudem Express', bus: 'BUS-112', fee: 9500, time: '55 mins', color: '#fb923c' },
        { name: 'Chintalapudi Rural', bus: 'BUS-113', fee: 10500, time: '65 mins', color: '#a3e635' },
        { name: 'Lingapalem Cross', bus: 'BUS-114', fee: 8500, time: '45 mins', color: '#e879f9' },
        { name: 'Dharmajigudem Route', bus: 'BUS-115', fee: 7500, time: '35 mins', color: '#38bdf8' },
        { name: 'T.Narasapuram Center', bus: 'BUS-116', fee: 9000, time: '50 mins', color: '#818cf8' },
        { name: 'Bhimadole Junction', bus: 'BUS-117', fee: 11500, time: '80 mins', color: '#c084fc' },
        { name: 'Pedavegi Heritage', bus: 'BUS-118', fee: 6500, time: '30 mins', color: '#fbbf24' },
        { name: 'Akiveedu Bypass', bus: 'BUS-119', fee: 12500, time: '95 mins', color: '#4ade80' },
        { name: 'Hanuman Junction', bus: 'BUS-120', fee: 11000, time: '75 mins', color: '#f43f5e' }
      ];

      for (let i = 0; i < routeConfigs.length; i++) {
        const config = routeConfigs[i];
        
        // 1. Create Bus
        const bus = await Bus.create({
          busNumber: config.bus,
          driverName: `Driver ${i + 1}`,
          driverContact: `+91 9440${100000 + i}`,
          totalSeats: 40,
          availableSeats: Math.floor(Math.random() * 30) + 5,
          currentLocation: { 
            lat: schoolLocation.lat + getRandomOffset(0.2), 
            lng: schoolLocation.lng + getRandomOffset(0.2) 
          }
        });

        // 2. Create Route
        const route = await Route.create({
          routeName: `${config.name} Route`,
          routeNumber: `R-${config.bus.split('-')[1]}-0${i + 1}`,
          villagesCovered: [config.name, 'Nearby Village'],
          timing: { pickup: '07:00 AM', drop: '05:00 PM' },
          fee: config.fee,
          estimatedTime: config.time,
          color: config.color,
          bus: bus._id,
          path: [
            { 
              lat: schoolLocation.lat + getRandomOffset(0.3), 
              lng: schoolLocation.lng + getRandomOffset(0.3) 
            },
            schoolLocation
          ]
        });

        // 3. Create Pickup Point
        await PickupPoint.create({
          name: config.name,
          location: route.path[0],
          route: route._id
        });
      }
      console.log('✅ Transport Data seeded successfully!');
    }
  } catch (err) {
    console.error('❌ Error seeding Transport Data:', err.message);
  }
};

// Connect to MongoDB AFTER starting server to avoid port timeout
const startMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
    
    // --- Startup Diagnostics ---
    console.log('📊 Startup Diagnostics:');
    const hostelRoomCount = await HostelRoom.countDocuments();
    const busCount = await Bus.countDocuments();
    const routeCount = await Route.countDocuments();
    const pickupPointCount = await PickupPoint.countDocuments();
    const hostelPaymentCount = await HostelPayment.countDocuments();
    const razorpayKeyStatus = process.env.RAZORPAY_KEY_ID ? '✅ Set' : '❌ Missing';
    
    console.log(`  - Hostel Rooms: ${hostelRoomCount}`);
    console.log(`  - Buses: ${busCount}`);
    console.log(`  - Routes: ${routeCount}`);
    console.log(`  - Pickup Points: ${pickupPointCount}`);
    console.log(`  - Hostel Payments: ${hostelPaymentCount}`);
    console.log(`  - Razorpay Key ID: ${razorpayKeyStatus}`);
    
    // Auto seed data
    if (hostelRoomCount === 0) {
      await seedHostelRooms();
    } else {
      console.log('ℹ️ Hostel Rooms already seeded');
    }
    
    if (busCount === 0) {
      await seedTransportData();
    } else {
      console.log('ℹ️ Transport Data already seeded');
    }
  } catch (err) {
    console.error(`❌ Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

// Routes
const feeRoutes = require('./routes/feeRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const transportRoutes = require('./routes/transportRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const hostelApplicationRoutes = require('./routes/hostelApplicationRoutes');
const hostelPaymentRoutes = require('./routes/hostelPaymentRoutes');

// --- Health & Debug APIs
app.get('/api/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbConnected = dbState === 1;
    
    // Check transport models exist
    const transportHealth = await HostelRoom.countDocuments().catch(() => 0);
    const hostelHealth = await HostelRoom.countDocuments().catch(() => 0);

    res.status(200).json({
      success: true,
      database: dbConnected,
      transport: true,
      hostel: true,
      payment: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/debug/transport', async (req, res) => {
  try {
    const [buses, routes, pickupPoints, assignments, payments] = await Promise.all([
      Bus.countDocuments(),
      Route.countDocuments(),
      PickupPoint.countDocuments(),
      TransportAssignment.countDocuments(),
      TransportPayment.countDocuments()
    ]);
    res.status(200).json({
      success: true, data: { buses, routes, pickupPoints, assignments, payments } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/debug/hostel', async (req, res) => {
  try {
    const [rooms, payments] = await Promise.all([
      HostelRoom.countDocuments(),
      HostelPayment.countDocuments()
    ]);
    res.status(200).json({ success: true, data: { rooms, payments } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/debug/payment', async (req, res) => {
  res.status(200).json({
    success: true, data: {
      razorpayKeyId: process.env.RAZORPAY_KEY_ID ? 'set' : 'missing'
    }
  });
});

// --- Normal Routes
app.use('/api/fees', feeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/hostel', hostelRoutes); // For compatibility with frontend's "hostel"
app.use('/api/hostel-applications', hostelApplicationRoutes);
app.use('/api/hostel-payments', hostelPaymentRoutes);

// Simple root route
app.get('/', (req, res) => {
  res.send('KRR BrightMinds School API is running...');
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  // Send initial stats on connection
  const sendInitialStats = async () => {
    try {
      const [hostelStats, transportStats] = await Promise.all([
        HostelRoom.aggregate([
          {
            $group: {
              _id: { hostelType: "$hostelType", roomType: "$roomType" },
              totalBeds: { $sum: "$totalBeds" },
              occupiedBeds: { $sum: "$occupiedBeds" },
              availableBeds: { $sum: "$availableBeds" },
              roomCount: { $sum: 1 }
            }
          }
        ]),
        Promise.all([
          Bus.countDocuments(),
          Route.countDocuments(),
          PickupPoint.countDocuments(),
          TransportAssignment.countDocuments()
        ])
      ]);

      const formattedHostelStats = {
        boys: { ac: 0, nonAc: 0 },
        girls: { ac: 0, nonAc: 0 }
      };
      hostelStats.forEach(stat => {
        const hostelTypeLower = stat._id.hostelType.toLowerCase();
        const roomTypeLower = stat._id.roomType.toLowerCase();
        const key = roomTypeLower.includes('non') ? 'nonAc' : 'ac';
        if (formattedHostelStats[hostelTypeLower]) {
          formattedHostelStats[hostelTypeLower][key] = stat.availableBeds;
        }
      });

      socket.emit('initialStats', {
        hostel: formattedHostelStats,
        transport: {
          totalBuses: transportStats[0],
          activeRoutes: transportStats[1],
          totalPickupPoints: transportStats[2],
          studentsUsingTransport: transportStats[3]
        }
      });
    } catch (err) {
      console.error('❌ Error sending initial stats:', err);
    }
  };
  sendInitialStats();

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Make io available to controllers
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  // Start MongoDB connection after server is listening
  startMongoDB();
});
