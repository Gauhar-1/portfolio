import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { getSession } from '@/lib/session';
import { rateLimiter } from '@/lib/ratelimit';

const limiter = rateLimiter({
  tokens: 5, // 5 requests
  interval: 60 * 1000, // per minute
});

export async function POST(req: NextRequest) {
    const rateLimitResponse = await limiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    await dbConnect();
    
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Please provide email and password' }, { status: 400 });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }
        console.log("User", user);

        // Check if password matches
        const isMatch = password == user.password;

        if (!isMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create session
        const session = await getSession();
        session.userId = user._id as string;
        session.isLoggedIn = true;
        await session.save();

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
