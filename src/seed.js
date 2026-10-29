// Seeds the default event categories and an admin user.
// Usage: npm run seed   (set ADMIN_EMAIL / ADMIN_PASSWORD in .env to override defaults)
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const User = require('./models/User');

const categories = [
  { name: 'Weddings', description: 'Wedding planners, venues, caterers, photographers' },
  { name: 'Birthdays', description: 'Birthday party services and entertainment' },
  { name: 'Corporate Events', description: 'Conferences, offsites and company functions' },
  { name: 'Parties', description: 'Private parties, DJs, decorators and more' },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  for (const c of categories) {
    await Category.updateOne({ name: c.name }, { $setOnInsert: c }, { upsert: true });
  }
  console.log('Categories seeded');

  const email = (process.env.ADMIN_EMAIL || 'admin@harevent.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin1234';
  if (!(await User.findOne({ email }))) {
    await User.create({ name: 'Admin', email, password, role: 'admin' });
    console.log(`Admin created: ${email} / ${password}`);
  } else {
    console.log('Admin already exists');
  }

  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
