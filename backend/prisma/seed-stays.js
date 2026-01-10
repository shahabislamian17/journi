const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding stays...');

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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

