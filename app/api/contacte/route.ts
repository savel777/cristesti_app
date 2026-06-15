import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Preluăm toate cele 233 de contacte din cloud-ul Aiven
        const dateAiven = await prisma.ghidTelefon.findMany({
            orderBy: {
                numePrenume: 'asc', // Le trimitem deja sortate alfabetic
            },
        });

        return NextResponse.json(dateAiven);
    } catch (error) {
        console.error('Eroare la preluarea contactelor:', error);
        return NextResponse.json({ error: 'Nu s-au putut încărca datele' }, { status: 500 });
    }
}