const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Bus, Route, PickupPoint } = require('./models/Transport');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for massive 17+ route seeding...');

    await Bus.deleteMany({});
    await Route.deleteMany({});
    await PickupPoint.deleteMany({});

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

      // 3. Create Pickup Point (the "Checkpoint")
      await PickupPoint.create({
        name: config.name,
        location: route.path[0],
        route: route._id
      });
    }

    console.log('17+ Extended routes and checkpoints seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding 17+ routes:', error);
    process.exit(1);
  }
};

seedData();
