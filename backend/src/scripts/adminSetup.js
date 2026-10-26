import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';

/**
 * Administrative Account Initial Setup & Management CLI Tool
 *
 * Usage:
 *   node src/scripts/adminSetup.js
 *   node src/scripts/adminSetup.js --reset-password "MyNewSecurePassword123!"
 *   node src/scripts/adminSetup.js --email "admin@example.com" --password "SecurePass123!"
 */
async function runSetup() {
  console.log('========================================================');
  console.log('🔒 Portfolio Admin Dashboard Setup & Seeder');
  console.log('========================================================');

  const args = process.argv.slice(2);
  let targetEmail = env.ADMIN_EMAIL;
  let targetPassword = env.ADMIN_DEFAULT_PASSWORD;
  let forceReset = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      targetEmail = args[i + 1];
      i++;
    } else if (args[i] === '--password' && args[i + 1]) {
      targetPassword = args[i + 1];
      i++;
    } else if (args[i] === '--reset-password' && args[i + 1]) {
      targetPassword = args[i + 1];
      forceReset = true;
      i++;
    }
  }

  if (!env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is missing in backend/.env.');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully.');

    const normalizedEmail = targetEmail.toLowerCase().trim();
    const existingAdmin = await Admin.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (existingAdmin && !forceReset) {
      console.log(`ℹ️ Admin account already exists for: ${existingAdmin.email} (${existingAdmin.name})`);
      console.log('To update or reset password, run:');
      console.log(`  npm run admin:setup -- --reset-password "your_new_password"`);
      await mongoose.disconnect();
      process.exit(0);
    }

    if (!targetPassword || targetPassword.length < 8) {
      console.error('❌ Target password must be at least 8 characters long.');
      await mongoose.disconnect();
      process.exit(1);
    }

    const passwordHash = await Admin.hashPassword(targetPassword);

    if (existingAdmin && forceReset) {
      existingAdmin.passwordHash = passwordHash;
      await existingAdmin.save();
      console.log(`✅ Password successfully updated for admin: ${existingAdmin.email}`);
    } else {
      const newAdmin = await Admin.create({
        name: 'Sumit Kumar',
        email: normalizedEmail,
        passwordHash,
        role: 'superadmin',
      });
      console.log(`🎉 Superadmin account created successfully!`);
      console.log(`   Email: ${newAdmin.email}`);
      console.log(`   Role:  ${newAdmin.role}`);
    }

    console.log('========================================================');
    console.log('You can now log in at: /admin/login');
    console.log('========================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`❌ Admin setup failed: ${err.message}`);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

runSetup();
