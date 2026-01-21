// Script to seed the live/production database
// Usage: DATABASE_URL="your-live-db-url" node seed-live.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Use the live database URL from environment variable
const liveDbUrl = process.env.DATABASE_URL;

if (!liveDbUrl) {
  console.error('Error: DATABASE_URL environment variable is required');
  console.error('Usage: DATABASE_URL="your-live-db-url" node seed-live.js');
  process.exit(1);
}

// Create Prisma client with live database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: liveDbUrl
    }
  }
});

// Import the main seeding function from seed.js
// We'll copy the main logic here to ensure it uses the correct Prisma client

async function main() {
  console.log('Seeding LIVE database...');
  console.log('Database URL:', liveDbUrl.substring(0, 30) + '...' + liveDbUrl.substring(liveDbUrl.length - 20));

  // Create categories
  const sightseeing = await prisma.category.upsert({
    where: { slug: 'sightseeing' },
    update: {},
    create: {
      name: 'Sightseeing',
      slug: 'sightseeing',
      description: 'Discover the beauty of Ibiza through guided tours and sightseeing experiences',
      banner: '/assets/images/global/banners/banner-1.jpg'
    }
  });

  const entertainment = await prisma.category.upsert({
    where: { slug: 'entertainment' },
    update: {},
    create: {
      name: 'Entertainment',
      slug: 'entertainment',
      description: 'Nightlife, parties, and entertainment experiences',
      banner: '/assets/images/global/banners/banner-2.jpg'
    }
  });

  const wellness = await prisma.category.upsert({
    where: { slug: 'wellness' },
    update: {},
    create: {
      name: 'Wellness',
      slug: 'wellness',
      description: 'Relaxation, spa, and wellness experiences',
      banner: '/assets/images/global/banners/banner-1.jpg'
    }
  });

  const artCulture = await prisma.category.upsert({
    where: { slug: 'art-culture' },
    update: {},
    create: {
      name: 'Art & Culture',
      slug: 'art-culture',
      description: 'Art galleries, museums, and cultural experiences',
      banner: '/assets/images/global/banners/banner-1.jpg'
    }
  });

  const foodDrink = await prisma.category.upsert({
    where: { slug: 'food-drink' },
    update: {},
    create: {
      name: 'Food & Drink',
      slug: 'food-drink',
      description: 'Culinary experiences, restaurants, and food tours',
      banner: '/assets/images/global/banners/banner-1.jpg'
    }
  });

  const sports = await prisma.category.upsert({
    where: { slug: 'sports' },
    update: {},
    create: {
      name: 'Sports',
      slug: 'sports',
      description: 'Sports activities and athletic experiences',
      banner: '/assets/images/global/banners/banner-1.jpg'
    }
  });

  // Create host user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const hostUser = await prisma.user.upsert({
    where: { email: 'host@example.com' },
    update: {
      languages: JSON.stringify(['English', 'Spanish', 'French', 'German']),
      avatar: '/assets/images/global/hosts/host-1.jpg'
    },
    create: {
      email: 'host@example.com',
      password: hashedPassword,
      firstName: 'Captain',
      lastName: 'John',
      phone: '+1234567891',
      emailVerified: true,
      role: 'HOST',
      avatar: '/assets/images/global/hosts/host-1.jpg',
      languages: JSON.stringify(['English', 'Spanish', 'French', 'German'])
    }
  });

  // Remove all existing experience data so we fully replace with the new set
  await prisma.booking.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.availabilitySlot.deleteMany({});
  await prisma.experienceImage.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.experience.deleteMany({});

  // Client's 10 experiences data
  const experiencesData = [
    {
      id: 1,
      slug: "discover-formentera-on-a-beautiful-catamaran",
      title: "Discover Formentera on a beautiful catamaran",
      destination: "Formentera",
      duration: "4 Hours",
      rating: 4.7,
      from_price_eur: 125,
      image: "assets/images/experiences/experience-1a.jpg",
      labels: ["Featured"],
      categorySlug: "sightseeing"
    },
    {
      id: 2,
      slug: "sail-around-ibiza-at-sunset-with-champagne-and-aperitifs",
      title: "Sail around Ibiza at sunset with champagne and aperitifs",
      destination: "Ibiza",
      duration: "2.5 Hours",
      rating: 4.5,
      from_price_eur: 90,
      image: "assets/images/experiences/experience-2a.jpg",
      labels: ["Featured"],
      categorySlug: "sightseeing"
    },
    {
      id: 3,
      slug: "enjoy-the-pristine-waters-around-ibiza-and-formentera",
      title: "Enjoy the pristine waters around Ibiza and Formentera",
      destination: "Ibiza & Formentera",
      duration: "8 Hours",
      rating: 4.7,
      from_price_eur: 100,
      image: "assets/images/experiences/experience-3a.jpg",
      labels: ["Featured", "New"],
      categorySlug: "sightseeing"
    },
    {
      id: 4,
      slug: "discover-the-other-side-of-ibiza",
      title: "Discover the other side of Ibiza",
      destination: "Ibiza",
      duration: "3 Hours",
      rating: 4.9,
      from_price_eur: 125,
      image: "assets/images/experiences/experience-4a.jpg",
      labels: ["Featured"],
      categorySlug: "sightseeing"
    },
    {
      id: 5,
      slug: "full-running-tour-of-ibiza-town",
      title: "Full running tour of Ibiza Town",
      destination: "Ibiza",
      duration: "2 Hours",
      rating: 5.0,
      from_price_eur: 50,
      image: "assets/images/experiences/experience-5a.jpg",
      labels: ["Featured"],
      categorySlug: "sports"
    },
    {
      id: 6,
      slug: "sail-from-ibiza-to-formentera-on-a-fantastic-boat",
      title: "Sail from Ibiza to Formentera on a fantastic boat",
      destination: "Ibiza & Formentera",
      duration: "6 Hours",
      rating: 4.5,
      from_price_eur: 175,
      image: "assets/images/experiences/experience-6a.jpg",
      labels: ["Featured", "New"],
      categorySlug: "sightseeing"
    },
    {
      id: 7,
      slug: "paddle-along-the-wildest-part-of-ibiza",
      title: "Paddle along the wildest part of Ibiza",
      destination: "Ibiza",
      duration: "3 Hours",
      rating: 4.9,
      from_price_eur: 50,
      image: "assets/images/experiences/experience-7a.jpg",
      labels: ["Featured"],
      categorySlug: "sports"
    },
    {
      id: 8,
      slug: "explore-formentera-by-sailboat",
      title: "Explore Formentera by sailboat",
      destination: "Formentera",
      duration: "6 Hours",
      rating: 4.9,
      from_price_eur: 150,
      image: "assets/images/experiences/experience-8a.jpg",
      labels: ["Featured"],
      categorySlug: "sightseeing"
    },
    {
      id: 9,
      slug: "discover-one-of-ibizas-most-secluded-beaches",
      title: "Discover one of Ibiza's most secluded beaches",
      destination: "Ibiza",
      duration: "4 Hours",
      rating: 4.8,
      from_price_eur: 50,
      image: "assets/images/experiences/experience-9a.jpg",
      labels: ["Featured"],
      categorySlug: "sightseeing"
    },
    {
      id: 10,
      slug: "a-tour-of-ibiza-old-town",
      title: "A tour of Ibiza old town",
      destination: "Ibiza",
      duration: "3 Hours",
      rating: 5.0,
      from_price_eur: 50,
      image: "assets/images/experiences/experience-10a.jpg",
      labels: ["Featured"],
      categorySlug: "art-culture"
    }
  ];

  // Map category slugs to category objects
  const categoryMap = {
    'sightseeing': sightseeing,
    'entertainment': entertainment,
    'wellness': wellness,
    'art-culture': artCulture,
    'food-drink': foodDrink,
    'sports': sports
  };

  // Create or update experiences
  const createdExperiences = [];
  for (const expData of experiencesData) {
    const category = categoryMap[expData.categorySlug] || sightseeing;
    
    // Parse duration to get hours
    const hoursMatch = expData.duration.match(/(\d+(?:\.\d+)?)/);
    const hours = hoursMatch ? parseFloat(hoursMatch[1]) : null;
    
    const experience = await prisma.experience.upsert({
      where: { slug: expData.slug },
      update: {
        title: expData.title,
        rating: expData.rating,
        price: expData.from_price_eur,
        duration: expData.duration,
        hours: hours,
        featured: expData.labels.includes('Featured'),
        isNew: expData.labels.includes('New'),
        location: expData.destination,
        hostId: hostUser.id,
        hostName: 'Captain John',
        hostImage: '/assets/images/global/hosts/host-1.jpg',
        description: `${expData.title}. Experience the beauty of ${expData.destination}.`,
        itinerary: JSON.stringify([
          {
            location: expData.destination,
            duration: expData.duration,
            description: `Enjoy this amazing ${expData.duration} experience in ${expData.destination}.`
          }
        ]),
        includedItems: JSON.stringify([
          {
            type: 'Equipment',
            description: 'All necessary equipment provided for the experience.'
          }
        ]),
        requirements: 'All ages welcome. Children must be accompanied by an adult.',
        accessibility: 'Message your host for accessibility details.',
        cancellationPolicy: 'Free cancellation up to 24 hours before the experience starts.'
      },
      create: {
        title: expData.title,
        slug: expData.slug,
        description: `${expData.title}. Experience the beauty of ${expData.destination}.`,
        categoryId: category.id,
        duration: expData.duration,
        hours: hours,
        price: expData.from_price_eur,
        rating: expData.rating,
        featured: expData.labels.includes('Featured'),
        isNew: expData.labels.includes('New'),
        location: expData.destination,
        hostId: hostUser.id,
        hostName: 'Captain John',
        hostImage: '/assets/images/global/hosts/host-1.jpg',
        itinerary: JSON.stringify([
          {
            location: expData.destination,
            duration: expData.duration,
            description: `Enjoy this amazing ${expData.duration} experience in ${expData.destination}.`
          }
        ]),
        includedItems: JSON.stringify([
          {
            type: 'Equipment',
            description: 'All necessary equipment provided for the experience.'
          }
        ]),
        requirements: 'All ages welcome. Children must be accompanied by an adult.',
        accessibility: 'Message your host for accessibility details.',
        cancellationPolicy: 'Free cancellation up to 24 hours before the experience starts.'
      }
    });

    createdExperiences.push(experience);

    // Create images for the experience
    await prisma.experienceImage.deleteMany({
      where: { experienceId: experience.id }
    });

    const imagePath = `/${expData.image}`;
    await prisma.experienceImage.createMany({
      data: [
        {
          experienceId: experience.id,
          original: imagePath,
          large: imagePath,
          medium: imagePath,
          small: imagePath,
          thumbnail: imagePath,
          isPrimary: true,
          order: 0
        },
        {
          experienceId: experience.id,
          original: imagePath,
          large: imagePath,
          medium: imagePath,
          small: imagePath,
          thumbnail: imagePath,
          isPrimary: false,
          order: 1
        },
        {
          experienceId: experience.id,
          original: imagePath,
          large: imagePath,
          medium: imagePath,
          small: imagePath,
          thumbnail: imagePath,
          isPrimary: false,
          order: 2
        },
        {
          experienceId: experience.id,
          original: imagePath,
          large: imagePath,
          medium: imagePath,
          small: imagePath,
          thumbnail: imagePath,
          isPrimary: false,
          order: 3
        }
      ]
    });

    // Create availability slots (10 slots per experience)
    await prisma.availabilitySlot.deleteMany({
      where: { experienceId: experience.id }
    });

    const slots = [];
    for (let i = 1; i <= 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      slots.push({
        experienceId: experience.id,
        date: date,
        startTime: i % 2 === 0 ? '10:00' : '14:00',
        endTime: i % 2 === 0 ? '14:00' : '18:00',
        price: experience.price,
        maxGuests: 20,
        available: true
      });
    }
    await prisma.availabilitySlot.createMany({ data: slots });

    // Create reviews (1-2 per experience)
    await prisma.review.deleteMany({
      where: { experienceId: experience.id }
    });

    // Create test users for reviews if they don't exist
    const reviewUsers = [];
    for (let i = 1; i <= 2; i++) {
      const user = await prisma.user.upsert({
        where: { email: `reviewer${i}@example.com` },
        update: {},
        create: {
          email: `reviewer${i}@example.com`,
          password: hashedPassword,
          firstName: `Reviewer${i}`,
          lastName: 'User',
          phone: `+123456789${i}`,
          emailVerified: true,
          role: 'TRAVELLER'
        }
      });
      reviewUsers.push(user);
    }

    // Create reviews
    const reviewComments = [
      'Amazing experience! Highly recommend to anyone visiting.',
      'Perfect day out! Everything was handled professionally.',
      'Incredible experience that we will remember forever.',
      'The tour was well-organized and the guide was knowledgeable.',
      'Would definitely book again on our next visit.'
    ];

    for (let i = 0; i < 2; i++) {
      await prisma.review.create({
        data: {
          userId: reviewUsers[i].id,
          experienceId: experience.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
          comment: reviewComments[i % reviewComments.length]
        }
      });
    }
  }

  console.log(`\n✅ Successfully seeded LIVE database!`);
  console.log(`Created/Updated:`);
  console.log(`  - ${createdExperiences.length} Experiences`);
  console.log(`  - ${createdExperiences.length * 4} Images`);
  console.log(`  - ${createdExperiences.length * 10} Availability Slots`);
  console.log(`  - ${createdExperiences.length * 2} Reviews`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

