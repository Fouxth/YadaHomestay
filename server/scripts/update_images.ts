import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Updating room images...');

    // Standard Rooms (101-103)
    await prisma.room.updateMany({
        where: { type: 'standard' },
        data: { image: '/images/rooms/standard.png' }
    });
    console.log('Updated Standard rooms');

    // Deluxe Rooms (201-202)
    await prisma.room.updateMany({
        where: { type: 'deluxe' },
        data: { image: '/images/rooms/deluxe.png' }
    });
    console.log('Updated Deluxe rooms');

    // Family Rooms (301-303)
    await prisma.room.updateMany({
        where: { type: 'family' },
        data: { image: '/images/rooms/family.png' }
    });
    console.log('Updated Family rooms');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
