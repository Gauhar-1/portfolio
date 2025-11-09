import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

type RateLimiterConfig = {
  tokens: number;
  interval: number; // in milliseconds
};

const ipStore = new Map<string, { count: number; expiry: number }>();

export function rateLimiter(config: RateLimiterConfig) {
  return async (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const now = Date.now();
    const windowStart = now - config.interval;

    const current = ipStore.get(ip) ?? { count: 0, expiry: 0 };
    
    if (current.expiry < windowStart) {
        // Reset count if the window has passed
        current.count = 0;
        current.expiry = now + config.interval;
    }

    current.count++;
    ipStore.set(ip, current);

    if (current.count > config.tokens) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return null; // Indicates request is allowed
  };
}
