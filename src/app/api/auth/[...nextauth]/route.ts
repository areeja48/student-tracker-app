import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import connectDB from '@/lib/mongodb'; // ✅ Should connect to your MongoDB
import User from '@/models/User';       // ✅ Your Mongoose User model

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      
      async authorize(credentials) {
        // ✅ Connect to MongoDB
        await connectDB();

        // ✅ Find the user by email
        const user = await User.findOne({ email: credentials?.email });

        if (!user) throw new Error('No user found');

        // ✅ Compare passwords
        const isPasswordValid = await compare(
          credentials!.password,
          user.password
        );

        if (!isPasswordValid) throw new Error('Invalid credentials');

        // ✅ Return user info (must return an object or null)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
     GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: '/dashboard', // ✅ Custom login page
  },

  session: {
    strategy: 'jwt', // ✅ Using JWT strategy (recommended)
  },

  secret: process.env.NEXTAUTH_SECRET, // ✅ Required
});

export { handler as GET, handler as POST }; // ✅ Must export both
