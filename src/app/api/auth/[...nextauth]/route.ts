
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      // For now, allow any signed-in user.
      // In a real app, you'd likely want to restrict this to specific admin users.
      // For example, by checking user.email against a whitelist.
      if (user.email) {
        return true;
      }
      return false;
    },
  },
});

export { handler as GET, handler as POST };
