import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        session.destroy();
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
