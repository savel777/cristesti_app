import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {

        const dateAiven = await prisma.ghidTelefon.findMany({
            orderBy: {
                numePrenume: 'asc',
            },
        });

        return NextResponse.json(dateAiven);
    } catch (error) {
        console.error('Eroare la preluarea contactelor:', error);
        return NextResponse.json({ error: 'Nu s-au putut încărca datele' }, { status: 500 });
    }
}