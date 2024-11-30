import NextAuth, { DefaultSession, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import User from '@/models/user.model';
import dbConnect from '@/dbConfig/dbConfig';
import { sendLoginNotification } from '@/utils/mailer';

// Define custom user type
interface CustomUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

declare module "next-auth" {
  interface User extends CustomUser {}
  
  interface Session extends DefaultSession {
    user: CustomUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends CustomUser {}
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        browser: { label: 'Browser', type: 'text', optional: true },
        os: { label: 'OS', type: 'text', optional: true },
        location: { label: 'Location', type: 'text', optional: true },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide both email and password');
          }

          await dbConnect();

          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error('No user found with this email');
          }

          const isPasswordValid = await bcryptjs.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          // Send login notification
          try {
            await sendLoginNotification({
              email: user.email,
              name: user.name,
              browser: credentials.browser,
              os: credentials.os,
              location: credentials.location
            });
          } catch (error) {
            console.error('Failed to send login notification:', error);
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user'
          };
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string
        }
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
