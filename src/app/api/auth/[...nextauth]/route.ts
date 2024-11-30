import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import User from '@/models/user.model';
import dbConnect from '@/dbConfig/dbConfig';
import { sendLoginNotification } from '@/utils/mailer';

// Define custom credentials type
interface CustomCredentials extends Record<"email" | "password", string> {
  browser?: string;
  os?: string;
  location?: string;
}

// Define custom user type
interface CustomUser {
  name: string;
  id: string;
  email: string;
  username?: string;
  role?: string;
}

declare module "next-auth" {
  interface User extends CustomUser {}
  
  interface Session {
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
      },
      async authorize(credentials): Promise<CustomUser | null> {
        const creds = credentials as CustomCredentials;
        
        if (!creds?.email || !creds?.password) {
          throw new Error('Please provide both email and password');
        }

        try {
          await dbConnect();
          const user = await User.findOne({ email: creds.email });

          if (!user) {
            throw new Error('Invalid email or password');
          }

          const isPasswordMatch = await bcryptjs.compare(
            creds.password,
            user.password
          );

          if (!isPasswordMatch) {
            throw new Error('Invalid email or password');
          }

          if (!user.isVerified) {
            throw new Error('Please verify your email before logging in');
          }

          // Only send login notification if we have meaningful device information
          const hasValidBrowser = creds.browser && creds.browser !== 'Unknown Browser';
          const hasValidOS = creds.os && creds.os !== 'Unknown OS';
          const hasValidLocation = creds.location && creds.location !== 'Unknown Location';

          // if (hasValidBrowser || hasValidOS || hasValidLocation) {
          //   try {
          //     await sendLoginNotification({
          //       email: user.email,
          //       name: user.username || user.email.split('@')[0],
          //       loginTime: new Date().toISOString(),
          //       deviceInfo: {
          //         browser: creds.browser || 'Unknown Browser',
          //         os: creds.os || 'Unknown OS',
          //         location: creds.location || 'Unknown Location'
          //       }
          //     });
          //   } catch (emailError) {
          //     console.error('Failed to send login notification:', emailError);
          //   }
          // }

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            name: user.username || user.email.split('@')[0],
            role: user.role,
          };
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: any): Promise<any> {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
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
