import 'server-only';
import { cookies } from 'next/headers';
import { getIronSession, IronSession, SessionOptions } from 'iron-session';

const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'devfolio-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export interface SessionData {
  userId?: string;
  isLoggedIn: boolean;
}

export async function getSession(): Promise<IronSession<SessionData>> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session;
}

declare module 'iron-session' {
  interface IronSessionData {
    userId?: string;
    isLoggedIn?: boolean;
  }
}
