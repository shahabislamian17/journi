const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

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

  const adventure = await prisma.category.upsert({
    where: { slug: 'adventure' },
    update: {},
    create: {
      name: 'Adventure',
      slug: 'adventure',
      description: 'Thrilling adventures and outdoor activities',
      banner: '/assets/images/global/banners/banner-1.jpg'
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

  // Create test user (Traveller) - needed before experiences
  const hashedPassword = await bcrypt.hash('password123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      phone: '+1234567890',
      emailVerified: true,
      role: 'TRAVELLER'
    }
  });

  // Create host users with languages
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

  const host2 = await prisma.user.upsert({
    where: { email: 'host2@example.com' },
    update: {
      languages: JSON.stringify(['English', 'Spanish', 'French', 'Italian', 'Portuguese']),
      avatar: '/assets/images/global/hosts/host-1.jpg'
    },
    create: {
      email: 'host2@example.com',
      password: hashedPassword,
      firstName: 'Captain',
      lastName: 'Maria',
      phone: '+1234567895',
      emailVerified: true,
      role: 'HOST',
      avatar: '/assets/images/global/hosts/host-1.jpg',
      languages: JSON.stringify(['English', 'Spanish', 'French', 'Italian', 'Portuguese'])
    }
  });

  const host3 = await prisma.user.upsert({
    where: { email: 'host3@example.com' },
    update: {
      languages: JSON.stringify(['English', 'German', 'Italian']),
      avatar: '/assets/images/global/hosts/host-1.jpg'
    },
    create: {
      email: 'host3@example.com',
      password: hashedPassword,
      firstName: 'Local',
      lastName: 'Guide Team',
      phone: '+1234567896',
      emailVerified: true,
      role: 'HOST',
      avatar: '/assets/images/global/hosts/host-1.jpg',
      languages: JSON.stringify(['English', 'German', 'Italian'])
    }
  });

  // ---------------------------------------------------------------------------
  // Create experiences
  // ---------------------------------------------------------------------------

  // Clear existing experience-related data so we fully replace with client's set
  await prisma.booking.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.availabilitySlot.deleteMany({});
  await prisma.experienceImage.deleteMany({});
  await prisma.experience.deleteMany({});

  // Base config from client + extra fields we need for the schema
  const experiencesConfig = [
    {
      slug: 'discover-formentera-on-a-beautiful-catamaran',
      title: 'Discover Formentera on a beautiful catamaran',
      destination: 'Formentera',
      duration: '4 Hours',
      rating: 4.7,
      price: 125,
      image: '/assets/images/experiences/experience-1a.jpg',
      labels: ['Featured'],
      categoryId: sightseeing.id,
      host: hostUser
    },
    {
      slug: 'sail-around-ibiza-at-sunset-with-champagne-and-aperitifs',
      title: 'Sail around Ibiza at sunset with champagne and aperitifs',
      destination: 'Ibiza',
      duration: '2.5 Hours',
      rating: 4.5,
      price: 90,
      image: '/assets/images/experiences/experience-2a.jpg',
      labels: ['Featured'],
      categoryId: sightseeing.id,
      host: host2
    },
    {
      slug: 'enjoy-the-pristine-waters-around-ibiza-and-formentera',
      title: 'Enjoy the pristine waters around Ibiza and Formentera',
      destination: 'Ibiza & Formentera',
      duration: '8 Hours',
      rating: 4.7,
      price: 100,
      image: '/assets/images/experiences/experience-3a.jpg',
      labels: ['Featured', 'New'],
      categoryId: sightseeing.id,
      host: hostUser
    },
    {
      slug: 'discover-the-other-side-of-ibiza',
      title: 'Discover the other side of Ibiza',
      destination: 'Ibiza',
      duration: '3 Hours',
      rating: 4.9,
      price: 125,
      image: '/assets/images/experiences/experience-4a.jpg',
      labels: ['Featured'],
      categoryId: sightseeing.id,
      host: host3
    },
    {
      slug: 'full-running-tour-of-ibiza-town',
      title: 'Full running tour of Ibiza Town',
      destination: 'Ibiza',
      duration: '2 Hours',
      rating: 5.0,
      price: 50,
      image: '/assets/images/experiences/experience-5a.jpg',
      labels: ['Featured'],
      categoryId: sightseeing.id,
      host: host3
    },
    {
      slug: 'sail-from-ibiza-to-formentera-on-a-fantastic-boat',
      title: 'Sail from Ibiza to Formentera on a fantastic boat',
      destination: 'Ibiza & Formentera',
      duration: '6 Hours',
      rating: 4.5,
      price: 175,
      image: '/assets/images/experiences/experience-6a.jpg',
      labels: ['Featured', 'New'],
      categoryId: sightseeing.id,
      host: hostUser
    },
    {
      slug: 'paddle-along-the-wildest-part-of-ibiza',
      title: 'Paddle along the wildest part of Ibiza',
      destination: 'Ibiza',
      duration: '3 Hours',
      rating: 4.9,
      price: 50,
      image: '/assets/images/experiences/experience-7a.jpg',
      labels: ['Featured'],
      categoryId: adventure.id,
      host: host3
    },
    {
      slug: 'explore-formentera-by-sailboat',
      title: 'Explore Formentera by sailboat',
      destination: 'Formentera',
      duration: '6 Hours',
      rating: 4.9,
      price: 150,
      image: '/assets/images/experiences/experience-8a.jpg',
      labels: ['Featured'],
      categoryId: sightseeing.id,
      host: host2
    },
    {
      slug: 'discover-one-of-ibizas-most-secluded-beaches',
      title: 'Discover one of Ibiza\'s most secluded beaches',
      destination: 'Ibiza',
      duration: '4 Hours',
      rating: 4.8,
      price: 50,
      image: '/assets/images/experiences/experience-9a.jpg',
      labels: ['Featured'],
      categoryId: sightseeing.id,
      host: hostUser
    },
    {
      slug: 'a-tour-of-ibiza-old-town',
      title: 'A tour of Ibiza old town',
      destination: 'Ibiza',
      duration: '3 Hours',
      rating: 5.0,
      price: 50,
      image: '/assets/images/experiences/experience-10a.jpg',
      labels: ['Featured'],
      categoryId: sightseeing.id,
      host: host3
    }
  ];

  // Helper to parse hours from "4 Hours" etc.
  const parseHoursFromDuration = (duration) => {
    if (!duration) return null;
    const match = duration.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : null;
  };

  // Generic included items / itinerary used for all (good enough for testing)
  const defaultIncludedItems = JSON.stringify([
    {
      type: 'Guide',
      description: 'Local expert guide to host and support you throughout the experience.'
    },
    {
      type: 'Equipment',
      description: 'All necessary safety and activity equipment is provided.'
    }
  ]);

  const defaultItinerary = JSON.stringify([
    {
      location: 'Meeting point',
      duration: '30 minutes',
      description: 'Meet your host, get a short briefing and prepare for the experience.'
    },
    {
      location: 'Main activity',
      duration: '2-4 hours',
      description: 'Enjoy the core part of the experience with your group and host.'
    },
    {
      location: 'Return',
      duration: '30 minutes',
      description: 'Return to the starting point and say goodbye to your host.'
    }
  ]);

  const createdExperiences = [];

  for (const config of experiencesConfig) {
    const hours = parseHoursFromDuration(config.duration);
    const isFeatured = config.labels?.includes('Featured');
    const isNew = config.labels?.includes('New');

    const experience = await prisma.experience.create({
      data: {
        title: config.title,
        slug: config.slug,
        description: `${config.title} in ${config.destination}. Book now to enjoy one of our favourite experiences in Ibiza and Formentera.`,
        categoryId: config.categoryId,
        duration: config.duration,
        hours: hours,
        price: config.price,
        rating: config.rating,
        featured: !!isFeatured,
        isNew: !!isNew,
        location: config.destination,
        itinerary: defaultItinerary,
        includedItems: defaultIncludedItems,
        hostId: config.host.id,
        hostName: `${config.host.firstName} ${config.host.lastName}`,
        hostImage: '/assets/images/global/hosts/host-1.jpg',
        requirements: 'Guests must be able to walk short distances and follow basic safety instructions.',
        accessibility: 'Message your host for specific accessibility questions.',
        cancellationPolicy: 'Free cancellation up to 24 hours before the experience starts.'
      }
    });

    // Attach primary images (same image repeated for gallery)
    await prisma.experienceImage.createMany({
      data: [0, 1, 2, 3].map((index) => ({
        experienceId: experience.id,
        original: config.image,
        large: config.image,
        medium: config.image,
        small: config.image,
        thumbnail: config.image,
        isPrimary: index === 0,
        order: index
      }))
    });

    createdExperiences.push(experience);
  }

  // Create additional traveller users for reviews
  const traveller2 = await prisma.user.upsert({
    where: { email: 'traveller2@example.com' },
    update: {},
    create: {
      email: 'traveller2@example.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1234567892',
      emailVerified: true,
      role: 'TRAVELLER'
    }
  });

  const traveller3 = await prisma.user.upsert({
    where: { email: 'traveller3@example.com' },
    update: {},
    create: {
      email: 'traveller3@example.com',
      password: hashedPassword,
      firstName: 'Michael',
      lastName: 'Brown',
      phone: '+1234567893',
      emailVerified: true,
      role: 'TRAVELLER'
    }
  });


  // Create Availability Slots for all experiences
  console.log('Creating availability slots...');

  const availabilityData = [];
  for (const exp of createdExperiences) {
    for (let i = 1; i <= 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      availabilityData.push({
        experienceId: exp.id,
        date,
        startTime: i % 2 === 0 ? '10:00' : '15:00',
        endTime: i % 2 === 0 ? '13:00' : '18:00',
        price: exp.price,
        maxGuests: 20,
        available: true
      });
    }
  }
  await prisma.availabilitySlot.createMany({ data: availabilityData });

  // Create Bookings for a subset of experiences (for testing)
  console.log('Creating bookings...');

  const bookings = [];
  for (let i = 0; i < createdExperiences.length; i++) {
    const exp = createdExperiences[i];
    const date = new Date(Date.now() + (i + 3) * 24 * 60 * 60 * 1000);
    const booking = await prisma.booking.create({
      data: {
        userId: i % 2 === 0 ? testUser.id : traveller2.id,
        experienceId: exp.id,
        date,
        guests: 2,
        totalPrice: exp.price * 2,
        status: i % 3 === 0 ? 'completed' : 'confirmed',
        paymentStatus: 'paid',
        paymentIntentId: `pi_seed_${i + 1}`
      }
    });
    bookings.push(booking);
  }

  // Create Experience Reviews for all experiences
  console.log('Creating experience reviews...');

  const reviewers = [testUser, traveller2, traveller3];
  let reviewerIndex = 0;

  for (let i = 0; i < createdExperiences.length; i++) {
    const exp = createdExperiences[i];
    const reviewer = reviewers[reviewerIndex % reviewers.length];
    reviewerIndex++;

    await prisma.review.create({
      data: {
        userId: reviewer.id,
        experienceId: exp.id,
        bookingId: bookings[i]?.id || null,
        rating: Math.round(exp.rating || 5),
        comment: `Test review for "${exp.title}". This is sample content to validate the reviews section on the experience detail page.`
      }
    });
  }

  // Create additional experience reviews
  const nathanUser = await prisma.user.upsert({
    where: { email: 'nathan.blecharcyzk@example.com' },
    update: {},
    create: {
      email: 'nathan.blecharcyzk@example.com',
      password: hashedPassword,
      firstName: 'Nathan',
      lastName: 'Blecharcyzk',
      phone: '+1234567894',
      emailVerified: true,
      role: 'TRAVELLER'
    }
  });

  // Extra seeded review linked to the first seeded experience (if available)
  if (createdExperiences.length > 0) {
    await prisma.review.create({
      data: {
        userId: nathanUser.id,
        experienceId: createdExperiences[0].id,
        rating: 5,
        comment: 'Amazing experience! The catamaran was beautiful and the crew was very friendly. Highly recommend!'
      }
    });
  }

  // Create Messages
  console.log('Creating messages...');
  
  await prisma.message.deleteMany({
    where: {
      userId: { in: [testUser.id, traveller2.id, traveller3.id] }
    }
  });

  await prisma.message.create({
    data: {
      userId: testUser.id,
      subject: 'Welcome to Journi!',
      message: 'Thank you for joining Journi! We\'re excited to help you discover amazing experiences in Ibiza. If you have any questions, feel free to reach out.',
      read: false
    }
  });

  await prisma.message.create({
    data: {
      userId: testUser.id,
      subject: 'Booking Confirmation - Discover Formentera',
      message: 'Your booking for "Discover Formentera on a beautiful catamaran" has been confirmed. We look forward to seeing you on the tour!',
      read: true
    }
  });

  await prisma.message.create({
    data: {
      userId: testUser.id,
      subject: 'Review Request',
      message: 'How was your experience? We\'d love to hear your feedback about your recent booking.',
      read: false
    }
  });

  await prisma.message.create({
    data: {
      userId: traveller2.id,
      subject: 'Special Offer - Summer Experiences',
      message: 'Check out our special summer offers on selected experiences. Book now and save up to 20%!',
      read: false
    }
  });

  await prisma.message.create({
    data: {
      userId: traveller3.id,
      subject: 'Booking Reminder',
      message: 'Just a friendly reminder that your walking tour is scheduled for tomorrow at 9:00 AM. See you there!',
      read: true
    }
  });

  console.log('Main seeding completed!');
  console.log('\nTest Data Summary:');
  console.log('Users:');
  console.log('  - test@example.com (Traveller) - Password: password123');
  console.log('  - host@example.com (Host) - Password: password123');
  console.log('  - traveller2@example.com (Traveller) - Password: password123');
  console.log('  - traveller3@example.com (Traveller) - Password: password123');
  console.log('\nCreated:');
  console.log(`  - ${availabilityData.length} Availability Slots`);
  console.log(`  - ${bookings.length} Bookings (various statuses)`);
  console.log(`  - ${createdExperiences.length + 2} Experience Reviews`);
  console.log('  - 5 Messages');

  // Run additional seed files
  console.log('\n=== Running additional seeds ===');
  
  // Seed stays
  console.log('Seeding stays...');
  try {
    const seedStays = require('./seed-stays');
    // Since seed-stays.js has its own main() that disconnects, we need to call it differently
    // We'll use the PrismaClient from here instead
    await seedStaysSeeding(prisma);
  } catch (error) {
    console.error('Error seeding stays:', error);
  }

  // Seed cars
  console.log('Seeding cars...');
  try {
    await seedCarsSeeding(prisma);
  } catch (error) {
    console.error('Error seeding cars:', error);
  }

  // Seed website reviews
  console.log('Seeding website reviews...');
  try {
    await seedReviewsSeeding(prisma, bcrypt);
  } catch (error) {
    console.error('Error seeding website reviews:', error);
  }

  console.log('\n=== All seeding completed! ===');
}

// Helper functions to seed stays, cars, and reviews using shared PrismaClient
async function seedStaysSeeding(prisma) {
  // Clear existing stays
  await prisma.stay.deleteMany({});

  const stays = [
    {
      name: 'Oku',
      location: 'Sant Antoni de Portmany',
      rating: 5,
      price: 400,
      image: '/assets/images/stays/stay-1a.jpg',
      type: 'Hotel',
      featured: true,
      externalUrl: 'https://example.com/bookings/oku?ref=journi&code=COMM123'
    },
    {
      name: '7 Pines Resort',
      location: 'Sant Josep de sa Talaia',
      rating: 5,
      price: 250,
      image: '/assets/images/stays/stay-2a.jpg',
      type: 'Hotel',
      featured: true,
      externalUrl: 'https://example.com/bookings/7pines?ref=journi&code=COMM123'
    },
    {
      name: 'Six Senses',
      location: 'Portinatx',
      rating: 5,
      price: 600,
      image: '/assets/images/stays/stay-3a.jpg',
      type: 'Hotel',
      featured: true,
      externalUrl: 'https://example.com/bookings/sixsenses?ref=journi&code=COMM123'
    },
    {
      name: 'Nobu Hotel Ibiza Bay',
      location: 'Talamanca',
      rating: 4,
      price: 350,
      image: '/assets/images/stays/stay-4a.jpg',
      type: 'Hotel',
      featured: true,
      externalUrl: 'https://example.com/bookings/nobu?ref=journi&code=COMM123'
    }
  ];

  for (const stay of stays) {
    await prisma.stay.create({
      data: stay
    });
  }

  console.log(`Created ${stays.length} stays`);
}

async function seedCarsSeeding(prisma) {
  // Clear existing cars
  await prisma.car.deleteMany({});

  const cars = [
    {
      name: 'Volkswagen Golf',
      type: 'Compact',
      price: 25,
      image: '/assets/images/cars/car-1a.jpg',
      featured: true,
      externalUrl: 'https://example.com/rentals/vw-golf?ref=journi&code=COMM123'
    },
    {
      name: 'Range Rover Velar',
      type: 'Luxury SUV',
      price: 100,
      image: '/assets/images/cars/car-2a.jpg',
      featured: true,
      externalUrl: 'https://example.com/rentals/range-rover?ref=journi&code=COMM123'
    },
    {
      name: 'BMW Z4',
      type: 'Sport',
      price: 100,
      image: '/assets/images/cars/car-3a.jpg',
      featured: true,
      externalUrl: 'https://example.com/rentals/bmw-z4?ref=journi&code=COMM123'
    },
    {
      name: 'Mercedes-Benz C-Class',
      type: 'Luxury',
      price: 75,
      image: '/assets/images/cars/car-2a.jpg',
      featured: true,
      externalUrl: 'https://example.com/rentals/mercedes-c?ref=journi&code=COMM123'
    }
  ];

  for (const car of cars) {
    await prisma.car.create({
      data: car
    });
  }

  console.log(`Created ${cars.length} cars`);
}

async function seedReviewsSeeding(prisma, bcrypt) {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create or get users for website reviews
  const users = [];
  
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
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

