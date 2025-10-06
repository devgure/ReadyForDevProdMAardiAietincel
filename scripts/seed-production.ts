import { PrismaClient, Gender, PlanType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding production database...');

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@etincel.app' },
    update: {},
    create: {
      email: 'admin@etincel.app',
      name: 'Admin',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);

  // Create test premium user
  const testPassword = await bcrypt.hash('test123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@etincel.app' },
    update: {},
    create: {
      email: 'test@etincel.app',
      password: testPassword,
      name: 'Test User',
      birthDate: new Date('1995-01-01'),
      gender: 'MALE',
      bio: 'Test account for development',
      isPremium: true,
      planType: 'GOLD',
      location: {
        type: 'Point',
        coordinates: [-82.6403, 27.7676], // St. Petersburg, FL
      },
      preferences: {
        create: {
          maxDistance: 50,
          minAge: 21,
          maxAge: 35,
          showMe: 'FEMALE',
        },
      },
    },
  });

  console.log(`✅ Test user created: ${testUser.email}`);

  console.log('🎉 Production seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });