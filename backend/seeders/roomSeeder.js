const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const HostelRoom = require('../models/HostelRoom');

// Load env vars from specific path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedRooms = async () => {
  try {
    // Set DNS servers for MongoDB connection fix
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '8.8.4.4']);

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for hostel room seeding...');

    const rooms = [];

    // 1. Boys AC Rooms (15)
    for (let i = 101; i <= 115; i++) {
      rooms.push({
        roomNumber: `BAC-${i}`,
        hostelType: 'Boys',
        roomType: 'AC',
        totalBeds: 4,
        occupiedBeds: 0,
        availableBeds: 4
      });
    }

    // 2. Boys Non-AC Rooms (15)
    for (let i = 101; i <= 115; i++) {
      rooms.push({
        roomNumber: `BNON-${i}`,
        hostelType: 'Boys',
        roomType: 'Non-AC',
        totalBeds: 4,
        occupiedBeds: 0,
        availableBeds: 4
      });
    }

    // 3. Girls AC Rooms (15)
    for (let i = 101; i <= 115; i++) {
      rooms.push({
        roomNumber: `GAC-${i}`,
        hostelType: 'Girls',
        roomType: 'AC',
        totalBeds: 4,
        occupiedBeds: 0,
        availableBeds: 4
      });
    }

    // 4. Girls Non-AC Rooms (15)
    for (let i = 101; i <= 115; i++) {
      rooms.push({
        roomNumber: `GNON-${i}`,
        hostelType: 'Girls',
        roomType: 'Non-AC',
        totalBeds: 4,
        occupiedBeds: 0,
        availableBeds: 4
      });
    }

    // Insert only new rooms
    let newRoomsCount = 0;
    for (const room of rooms) {
      const existingRoom = await HostelRoom.findOne({ roomNumber: room.roomNumber });
      if (!existingRoom) {
        await HostelRoom.create(room);
        newRoomsCount++;
      }
    }

    console.log(`✅ Hostel rooms seeded: ${newRoomsCount} new rooms (${newRoomsCount === 0 ? 'all rooms already existed' : ''}`);
    
    await mongoose.disconnect();
    return { success: true, newRooms: newRoomsCount };
  } catch (err) {
    console.error(`❌ Hostel room seeding error: ${err.message}`);
    if (mongoose.connection.readyState === 1) await mongoose.disconnect();
    throw err;
  }
};

// If running directly, execute the seed
if (require.main === module) {
  seedRooms()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedRooms;
