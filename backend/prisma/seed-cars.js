const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding cars...');

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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

