const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Bus, Route, PickupPoint } = require('./models/Transport');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for expanded local transport seeding...');

    await Bus.deleteMany({});
    await Route.deleteMany({});
    await PickupPoint.deleteMany({});

    const schoolLocation = { lat: 16.816, lng: 81.233 };
    
    // 1. Create 6 Local Buses
    const buses = await Bus.insertMany([
      { busNumber: 'AP-37-KRR-01', driverName: 'Srinivasa Rao', driverContact: '+91 9440123456', totalSeats: 50, availableSeats: 45, currentLocation: schoolLocation },
      { busNumber: 'AP-37-KRR-02', driverName: 'Venkatesh Reddy', driverContact: '+91 9440234567', totalSeats: 40, availableSeats: 12, currentLocation: { lat: 16.837, lng: 81.218 } },
      { busNumber: 'AP-37-KRR-03', driverName: 'Ravi Teja', driverContact: '+91 9440345678', totalSeats: 50, availableSeats: 28, currentLocation: { lat: 17.118, lng: 81.295 } },
      { busNumber: 'AP-37-KRR-04', driverName: 'Koteswara Rao', driverContact: '+91 9440456789', totalSeats: 45, availableSeats: 35, currentLocation: { lat: 16.780, lng: 81.330 } },
      { busNumber: 'AP-37-KRR-05', driverName: 'Prakash Raj', driverContact: '+91 9440567890', totalSeats: 50, availableSeats: 40, currentLocation: { lat: 16.850, lng: 81.400 } },
      { busNumber: 'AP-37-KRR-06', driverName: 'Satish Kumar', driverContact: '+91 9440678901', totalSeats: 40, availableSeats: 15, currentLocation: { lat: 16.700, lng: 81.150 } }
    ]);

    // 2. Create 6 Local Routes
    const routes = await Route.insertMany([
      {
        routeName: 'Kamavarapukota Route',
        routeNumber: 'R-01',
        villagesCovered: ['Tadikalapudi', 'Kamavarapukota'],
        timing: { pickup: '07:45 AM', drop: '04:15 PM' },
        fee: 12000,
        bus: buses[0]._id,
        path: [{ lat: 16.837, lng: 81.218 }, { lat: 16.816, lng: 81.233 }]
      },
      {
        routeName: 'Chintalapudi Route',
        routeNumber: 'R-02',
        villagesCovered: ['Chintalapudi', 'Lingapalem'],
        timing: { pickup: '07:00 AM', drop: '05:00 PM' },
        fee: 18000,
        bus: buses[1]._id,
        path: [{ lat: 17.065, lng: 81.047 }, { lat: 16.816, lng: 81.233 }]
      },
      {
        routeName: 'Jangareddygudem Route',
        routeNumber: 'R-03',
        villagesCovered: ['Jangareddygudem', 'Lakkavaram'],
        timing: { pickup: '07:15 AM', drop: '04:45 PM' },
        fee: 15000,
        bus: buses[2]._id,
        path: [{ lat: 17.118, lng: 81.295 }, { lat: 16.816, lng: 81.233 }]
      },
      {
        routeName: 'Dharmajigudem Route',
        routeNumber: 'R-04',
        villagesCovered: ['Dharmajigudem', 'Nagireddygudem'],
        timing: { pickup: '07:30 AM', drop: '04:30 PM' },
        fee: 14000,
        bus: buses[3]._id,
        path: [{ lat: 16.870, lng: 81.150 }, { lat: 16.816, lng: 81.233 }]
      },
      {
        routeName: 'T.Narasapuram Route',
        routeNumber: 'R-05',
        villagesCovered: ['T.Narasapuram', 'Borrampalem'],
        timing: { pickup: '07:20 AM', drop: '04:40 PM' },
        fee: 16000,
        bus: buses[4]._id,
        path: [{ lat: 17.050, lng: 81.250 }, { lat: 16.816, lng: 81.233 }]
      },
      {
        routeName: 'Bhimadole Route',
        routeNumber: 'R-06',
        villagesCovered: ['Bhimadole', 'Gundugolanu'],
        timing: { pickup: '06:45 AM', drop: '05:15 PM' },
        fee: 20000,
        bus: buses[5]._id,
        path: [{ lat: 16.820, lng: 81.260 }, { lat: 16.816, lng: 81.233 }]
      }
    ]);

    // 3. Create Local Pickup Points
    await PickupPoint.insertMany([
      { name: 'Kamavarapukota Center', location: { lat: 16.837, lng: 81.218 }, route: routes[0]._id },
      { name: 'Tadikalapudi Junction', location: { lat: 16.818, lng: 81.230 }, route: routes[0]._id },
      { name: 'Chintalapudi Stand', location: { lat: 17.065, lng: 81.047 }, route: routes[1]._id },
      { name: 'Lingapalem Cross', location: { lat: 16.924, lng: 81.033 }, route: routes[1]._id },
      { name: 'JRG Market', location: { lat: 17.118, lng: 81.295 }, route: routes[2]._id },
      { name: 'Dharmajigudem Main', location: { lat: 16.870, lng: 81.150 }, route: routes[3]._id },
      { name: 'T.Narasapuram Center', location: { lat: 17.050, lng: 81.250 }, route: routes[4]._id },
      { name: 'Bhimadole Junction', location: { lat: 16.820, lng: 81.260 }, route: routes[5]._id }
    ]);

    console.log('6 Local routes seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding 6 routes:', error);
    process.exit(1);
  }
};

seedData();
