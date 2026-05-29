const path = require('path');
const dotenv = require('dotenv');

// Import seeders
const seedRooms = require('./roomSeeder');
const seedTransport = require('./transportSeeder');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedAll = async () => {
  try {
    console.log('🚀 Starting full seeding process...\n');
    
    // Run room seeder
    await seedRooms();
    console.log('');
    
    // Run transport seeder
    await seedTransport();
    console.log('');
    
    console.log('✅ All seeding processes finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedAll();