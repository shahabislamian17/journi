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

  // Create experiences
  const experience1 = await prisma.experience.upsert({
    where: { slug: 'discover-formentera-catamaran' },
    update: {
      includedItems: JSON.stringify([
        {
          type: 'Food',
          description: 'Fresh Mediterranean dishes and seasonal snacks for a delightful, relaxed dining experience.'
        },
        {
          type: 'Drink',
          description: 'Fine wines, cocktails and soft drinks to keep you refreshed throughout the journey.'
        },
        {
          type: 'Equipment',
          description: 'Snorkeling gear, paddleboards, safety equipment, sun loungers and comfortable seating onboard.'
        }
      ]),
      requirements: 'Guests aged 16 and over can attend this experience.',
      accessibility: 'Message your host for accessibility details.',
      cancellationPolicy: 'This experience is non-refundable.'
    },
    create: {
      title: 'Discover Formentera on a beautiful catamaran',
      slug: 'discover-formentera-catamaran',
      description: 'Experience the stunning beauty of Formentera on a luxury catamaran. Enjoy crystal clear waters, beautiful beaches, and breathtaking views.',
      categoryId: sightseeing.id,
      duration: '4 Hours',
      hours: 4,
      price: 125,
      rating: 5.0,
      featured: true,
      isNew: false,
      location: 'Ibiza Port',
      itinerary: JSON.stringify([
        {
          location: 'Ibiza Port',
          duration: '30 minutes',
          description: 'Departure from Pg. de la Mar, embarking on a beautiful journey to Formentera.'
        },
        {
          location: 'Formentera Coast',
          duration: '2 hours',
          description: 'Sailing along the pristine Formentera coastline, stopping at secluded beaches for swimming and snorkeling.'
        },
        {
          location: 'Beach Stop',
          duration: '1 hour',
          description: 'Enjoy a refreshing swim, sunbathe on the deck, or try paddleboarding in the crystal-clear waters.'
        },
        {
          location: 'Pg. de la Mar',
          duration: '30 minutes',
          description: 'Return sail to Pg. de la Mar, capturing last memories of Formentera\'s beauty before a smooth, heartfelt farewell departure.'
        }
      ]),
      includedItems: JSON.stringify([
        {
          type: 'Food',
          description: 'Fresh Mediterranean dishes and seasonal snacks for a delightful, relaxed dining experience.'
        },
        {
          type: 'Drink',
          description: 'Fine wines, cocktails and soft drinks to keep you refreshed throughout the journey.'
        },
        {
          type: 'Equipment',
          description: 'Snorkeling gear, paddleboards, safety equipment, sun loungers and comfortable seating onboard.'
        }
      ]),
      hostId: hostUser.id,
      hostName: 'Captain John',
      hostImage: '/assets/images/global/hosts/host-1.jpg',
      requirements: 'Guests aged 16 and over can attend this experience.',
      accessibility: 'Message your host for accessibility details.',
      cancellationPolicy: 'This experience is non-refundable.'
    }
  });

  const experience2 = await prisma.experience.upsert({
    where: { slug: 'sail-ibiza-sunset' },
    update: {
      includedItems: JSON.stringify([
        {
          type: 'Food',
          description: 'Delicious aperitifs and canapés prepared with local ingredients.'
        },
        {
          type: 'Drink',
          description: 'Premium champagne and selected wines, plus soft drinks and water.'
        }
      ]),
      requirements: 'Guests aged 18 and over can attend this experience.',
      accessibility: 'Message your host for accessibility details.',
      cancellationPolicy: 'This experience is non-refundable.'
    },
    create: {
      title: 'Sail around Ibiza at sunset with champagne and aperitifs',
      slug: 'sail-ibiza-sunset',
      description: 'Enjoy a romantic sunset cruise around Ibiza with champagne and delicious aperitifs. Perfect for couples and special occasions.',
      categoryId: sightseeing.id,
      duration: '2.5 Hours',
      hours: 2.5,
      price: 90,
      rating: 5.0,
      featured: true,
      isNew: true,
      location: 'Ibiza Marina',
      includedItems: JSON.stringify([
        {
          type: 'Food',
          description: 'Delicious aperitifs and canapés prepared with local ingredients.'
        },
        {
          type: 'Drink',
          description: 'Premium champagne and selected wines, plus soft drinks and water.'
        }
      ]),
      hostId: host2.id,
      hostName: 'Captain Maria',
      hostImage: '/assets/images/global/hosts/host-1.jpg',
      requirements: 'Guests aged 16 and over can attend this experience.',
      accessibility: 'Message your host for accessibility details.',
      cancellationPolicy: 'This experience is non-refundable.'
    }
  });

  const experience3 = await prisma.experience.upsert({
    where: { slug: 'ibiza-old-town-tour' },
    update: {
      includedItems: JSON.stringify([
        {
          type: 'Equipment',
          description: 'Audio guide headset and map for self-guided exploration.'
        }
      ])
    },
    create: {
      title: 'Ibiza Old Town Walking Tour',
      slug: 'ibiza-old-town-tour',
      description: 'Explore the historic Dalt Vila, a UNESCO World Heritage site, with a knowledgeable local guide.',
      categoryId: sightseeing.id,
      duration: '3 Hours',
      hours: 3,
      price: 45,
      rating: 5.0,
      featured: false,
      isNew: false,
      location: 'Dalt Vila',
      includedItems: JSON.stringify([
        {
          type: 'Equipment',
          description: 'Audio guide headset and map for self-guided exploration.'
        }
      ]),
      hostId: host3.id,
      hostName: 'Local Guide Team',
      hostImage: '/assets/images/global/hosts/host-1.jpg',
      requirements: 'All ages welcome. Children must be accompanied by an adult.',
      accessibility: 'This tour is wheelchair accessible. Please contact us for specific arrangements.',
      cancellationPolicy: 'Free cancellation up to 24 hours before the experience starts.'
    }
  });

  // Create experience images
  // Delete existing images first to avoid duplicates
  await prisma.experienceImage.deleteMany({
    where: {
      experienceId: { in: [experience1.id, experience2.id, experience3.id] }
    }
  });

  // Function to create images for an experience
  const createExperienceImages = async (experienceId, imagePaths) => {
    const images = imagePaths.map((imagePath, index) => ({
      experienceId: experienceId,
      original: imagePath,
      large: imagePath,
      medium: imagePath,
      small: imagePath,
      thumbnail: imagePath,
      isPrimary: index === 0, // First image is primary
      order: index
    }));
    await prisma.experienceImage.createMany({ data: images });
  };

  // Experience 1: experience-1a.jpg, experience-1b.jpg, experience-1a.jpg, experience-1b.jpg
  await createExperienceImages(experience1.id, [
    '/assets/images/experiences/experience-1a.jpg',
    '/assets/images/experiences/experience-1b.jpg',
    '/assets/images/experiences/experience-1a.jpg',
    '/assets/images/experiences/experience-1b.jpg'
  ]);

  // Experience 2: experience-2a.jpg (repeated 4 times)
  await createExperienceImages(experience2.id, [
    '/assets/images/experiences/experience-2a.jpg',
    '/assets/images/experiences/experience-2a.jpg',
    '/assets/images/experiences/experience-2a.jpg',
    '/assets/images/experiences/experience-2a.jpg'
  ]);

  // Experience 3: experience-3a.jpg (repeated 4 times)
  await createExperienceImages(experience3.id, [
    '/assets/images/experiences/experience-3a.jpg',
    '/assets/images/experiences/experience-3a.jpg',
    '/assets/images/experiences/experience-3a.jpg',
    '/assets/images/experiences/experience-3a.jpg'
  ]);


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


  // Create Availability Slots
  console.log('Creating availability slots...');
  
  // Delete existing slots for these experiences
  await prisma.availabilitySlot.deleteMany({
    where: {
      experienceId: { in: [experience1.id, experience2.id, experience3.id] }
    }
  });

  // Create slots for experience1 (next 30 days)
  const slots1 = [];
  for (let i = 1; i <= 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    slots1.push({
      experienceId: experience1.id,
      date: date,
      startTime: i % 2 === 0 ? '10:30' : '13:00',
      endTime: i % 2 === 0 ? '14:30' : '17:00',
      price: experience1.price,
      maxGuests: 20,
      available: true
    });
  }
  await prisma.availabilitySlot.createMany({ data: slots1 });

  // Create slots for experience2
  const slots2 = [];
  for (let i = 1; i <= 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    slots2.push({
      experienceId: experience2.id,
      date: date,
      startTime: '18:00',
      endTime: '20:30',
      price: experience2.price,
      maxGuests: 15,
      available: true
    });
  }
  await prisma.availabilitySlot.createMany({ data: slots2 });

  // Create slots for experience3
  const slots3 = [];
  for (let i = 1; i <= 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    slots3.push({
      experienceId: experience3.id,
      date: date,
      startTime: '09:00',
      endTime: '12:00',
      price: experience3.price,
      maxGuests: 25,
      available: true
    });
  }
  await prisma.availabilitySlot.createMany({ data: slots3 });

  // Create Bookings
  console.log('Creating bookings...');
  
  await prisma.booking.deleteMany({
    where: {
      userId: { in: [testUser.id, traveller2.id, traveller3.id] }
    }
  });

  const booking1 = await prisma.booking.create({
    data: {
      userId: testUser.id,
      experienceId: experience1.id,
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      guests: 2,
      totalPrice: experience1.price * 2,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentIntentId: 'pi_test_123456'
    }
  });

  const booking2 = await prisma.booking.create({
    data: {
      userId: testUser.id,
      experienceId: experience2.id,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      guests: 1,
      totalPrice: experience2.price,
      status: 'pending',
      paymentStatus: 'pending'
    }
  });

  const booking3 = await prisma.booking.create({
    data: {
      userId: traveller2.id,
      experienceId: experience1.id,
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      guests: 3,
      totalPrice: experience1.price * 3,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentIntentId: 'pi_test_789012'
    }
  });

  const booking4 = await prisma.booking.create({
    data: {
      userId: traveller3.id,
      experienceId: experience3.id,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (completed)
      guests: 1,
      totalPrice: experience3.price,
      status: 'completed',
      paymentStatus: 'paid',
      paymentIntentId: 'pi_test_345678'
    }
  });

  // Create Experience Reviews
  console.log('Creating experience reviews...');
  
  await prisma.review.deleteMany({
    where: {
      experienceId: { in: [experience1.id, experience2.id, experience3.id] }
    }
  });

  // Reviews for experience1 (Discover Formentera)
  await prisma.review.create({
    data: {
      userId: testUser.id,
      experienceId: experience1.id,
      bookingId: booking1.id,
      rating: 5,
      comment: 'The catamaran was welcoming and the crew was incredibly friendly. The views of the island were unforgettable. Highly recommend this experience!'
    }
  });

  await prisma.review.create({
    data: {
      userId: traveller2.id,
      experienceId: experience1.id,
      bookingId: booking3.id,
      rating: 5,
      comment: 'Sailing to Formentera was absolutely beautiful. The peace and tranquility on the water, combined with a fresh lunch, made this an unforgettable day.'
    }
  });

  // Reviews for experience2 (Sail Ibiza Sunset)
  await prisma.review.create({
    data: {
      userId: testUser.id,
      experienceId: experience2.id,
      rating: 5,
      comment: 'The crew was incredibly helpful and the equipment was well-kept. The journey was seamless and the sights were absolutely stunning. Perfect sunset experience!'
    }
  });

  // Reviews for experience3 (Ibiza Old Town Tour)
  await prisma.review.create({
    data: {
      userId: traveller3.id,
      experienceId: experience3.id,
      bookingId: booking4.id,
      rating: 5,
      comment: 'Even during the holiday peak, the experience was calm and peaceful. The turquoise seas were mesmerizing, the catamaran was smooth, the food was great, and the crew was kind throughout.'
    }
  });

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

  await prisma.review.create({
    data: {
      userId: nathanUser.id,
      experienceId: experience1.id,
      rating: 5,
      comment: 'Amazing experience! The catamaran was beautiful and the crew was very friendly. Highly recommend!'
    }
  });

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

  console.log('Seeding completed!');
  console.log('\nTest Data Summary:');
  console.log('Users:');
  console.log('  - test@example.com (Traveller) - Password: password123');
  console.log('  - host@example.com (Host) - Password: password123');
  console.log('  - traveller2@example.com (Traveller) - Password: password123');
  console.log('  - traveller3@example.com (Traveller) - Password: password123');
  console.log('\nCreated:');
  console.log(`  - ${slots1.length + slots2.length + slots3.length} Availability Slots`);
  console.log('  - 4 Bookings (various statuses)');
  console.log('  - 5 Experience Reviews');
  console.log('  - 5 Messages');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

