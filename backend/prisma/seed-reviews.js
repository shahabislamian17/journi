const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding website reviews...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create or get users for website reviews
  const users = [];
  
  // User 1: Hugo Carretero
  const user1 = await prisma.user.upsert({
    where: { email: 'hugo.carretero@example.com' },
    update: {},
    create: {
      email: 'hugo.carretero@example.com',
      password: hashedPassword,
      firstName: 'Hugo',
      lastName: 'Carretero',
    }
  });
  users.push(user1);

  // User 2: Marysia Jaworska
  const user2 = await prisma.user.upsert({
    where: { email: 'marysia.jaworska@example.com' },
    update: {},
    create: {
      email: 'marysia.jaworska@example.com',
      password: hashedPassword,
      firstName: 'Marysia',
      lastName: 'Jaworska',
    }
  });
  users.push(user2);

  // User 3: Brian Chesky
  const user3 = await prisma.user.upsert({
    where: { email: 'brian.chesky@example.com' },
    update: {},
    create: {
      email: 'brian.chesky@example.com',
      password: hashedPassword,
      firstName: 'Brian',
      lastName: 'Chesky',
    }
  });
  users.push(user3);

  // User 4: Sarah Johnson
  const user4 = await prisma.user.upsert({
    where: { email: 'sarah.johnson@example.com' },
    update: {},
    create: {
      email: 'sarah.johnson@example.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
    }
  });
  users.push(user4);

  // User 5: Marco Rossi
  const user5 = await prisma.user.upsert({
    where: { email: 'marco.rossi@example.com' },
    update: {},
    create: {
      email: 'marco.rossi@example.com',
      password: hashedPassword,
      firstName: 'Marco',
      lastName: 'Rossi',
    }
  });
  users.push(user5);

  // User 6: Emma Thompson
  const user6 = await prisma.user.upsert({
    where: { email: 'emma.thompson@example.com' },
    update: {},
    create: {
      email: 'emma.thompson@example.com',
      password: hashedPassword,
      firstName: 'Emma',
      lastName: 'Thompson',
    }
  });
  users.push(user6);

  // Clear existing website reviews
  await prisma.websiteReview.deleteMany({});

  const websiteReviews = [
    {
      userId: user1.id,
      rating: 5,
      comment: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium.\n\nPulvinar vivamus fringilla lacus nec laculis massa nisl malesuada.',
      featured: true,
      reviewCount: 3,
      localGuide: false,
      source: 'Google'
    },
    {
      userId: user2.id,
      rating: 5,
      comment: 'Hendrerit semper vel class aptent taciti sociosqu ad litora torquent per conubia nostra semper inceptos himenaeos. Lorem ipsum dolor sit amet consectetur.\n\nQuisque faucibus ex sapien vitae pellentesque sem placerat pretium tellus duis convallis tempus leo eu aenean.',
      featured: true,
      reviewCount: 10,
      localGuide: true,
      source: 'Google'
    },
    {
      userId: user3.id,
      rating: 5,
      comment: 'Sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas. Laculis massa nisl malesuada lacinia integer nunc posuere.\n\nHendrerit semper vel class aptent taciti litora torquent per conubia nostra inceptos.',
      featured: true,
      reviewCount: 1,
      localGuide: false,
      source: 'Google'
    },
    {
      userId: user4.id,
      rating: 5,
      comment: 'Amazing experience! The tour was well-organized and the guide was knowledgeable. Highly recommend to anyone visiting Ibiza.\n\nThe views were breathtaking and the whole experience exceeded our expectations.',
      featured: true,
      reviewCount: 5,
      localGuide: false,
      source: 'Google'
    },
    {
      userId: user5.id,
      rating: 5,
      comment: 'Perfect day out! Everything was handled professionally from start to finish. The team made sure we had everything we needed.\n\nWould definitely book again on our next visit to Ibiza.',
      featured: true,
      reviewCount: 7,
      localGuide: true,
      source: 'Google'
    },
    {
      userId: user6.id,
      rating: 5,
      comment: 'Incredible experience that we will remember forever. The attention to detail and customer service was outstanding.\n\nThank you for making our trip to Ibiza so special!',
      featured: true,
      reviewCount: 2,
      localGuide: false,
      source: 'Google'
    }
  ];

  for (const review of websiteReviews) {
    await prisma.websiteReview.create({
      data: review
    });
  }

  console.log(`Created ${websiteReviews.length} website reviews`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

