import GoogleProvider from 'next-auth/providers/google'
import type { AuthOptions } from 'next-auth'
import { signIn } from 'next-auth/react'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/dashboard',
    signOut: '/',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, user, trigger, session }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
        token.name = user?.name || user?.email?.split('@')[0] || '';
        token.email = user?.email || '';
        token.role = 'user';
        token.picture = user?.image || '';
      }

      if (trigger === 'update' && session?.user?.name) {
        token.name = session.user.name;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
        image: token.picture as string,
      };
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.accessTokenExpires = token.accessTokenExpires as number;
      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
}

// Optional helper
export const signInWithGoogle = async () => {
  await signIn('google');
}
