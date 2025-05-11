const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
    // Create test users
  const password = await bcrypt.hash('password123', 10);
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice Smith',
      email: 'alice@example.com',
      password,
    },
  });
  
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password,
    },
  });
  
  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@example.com' },
    update: {},
    create: {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      password,
    },
  });
  
  console.log('Created users:', { alice, bob, charlie });
  
  // Create friendships
  const friendship1 = await prisma.friendship.upsert({
    where: {
      requesterId_addresseeId: {
        requesterId: alice.id,
        addresseeId: bob.id,
      },
    },
    update: {},
    create: {
      requesterId: alice.id,
      addresseeId: bob.id,
      status: 'ACCEPTED',
    },
  });
  
  const friendship2 = await prisma.friendship.upsert({
    where: {
      requesterId_addresseeId: {
        requesterId: alice.id,
        addresseeId: charlie.id,
      },
    },
    update: {},
    create: {
      requesterId: alice.id,
      addresseeId: charlie.id,
      status: 'PENDING',
    },
  });
  
  console.log('Created friendships:', { friendship1, friendship2 });
  
  // Create messages
  const message1 = await prisma.message.create({
    data: {
      content: 'Hey Bob, how are you?',
      senderId: alice.id,
      receiverId: bob.id,
    },
  });
  
  const message2 = await prisma.message.create({
    data: {
      content: 'I\'m doing well, thanks for asking!',
      senderId: bob.id,
      receiverId: alice.id,
    },
  });
  
  const message3 = await prisma.message.create({
    data: {
      content: 'What are your plans for the weekend?',
      senderId: alice.id,
      receiverId: bob.id,
    },
  });
  
  console.log('Created messages:', { message1, message2, message3 });
  
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
