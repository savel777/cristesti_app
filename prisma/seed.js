const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    console.log('Se încarcă datele în cloud pe Aiven...');

    const filePath = path.join(__dirname, 'date_telefoane.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const contacte = JSON.parse(fileData);

    await prisma.ghidTelefon.deleteMany({});

    const rezultat = await prisma.ghidTelefon.createMany({
        data: contacte,
    });

    console.log(`Succes! S-au importat toate cele ${rezultat.count} numere de telefon.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });