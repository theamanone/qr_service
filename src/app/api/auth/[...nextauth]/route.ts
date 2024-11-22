import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user.model";
import dbConnect from "@/dbConfig/dbConfig";
import bcrypt from "bcrypt";
import { sendEmail } from "@/utils/mailer";

interface UserType {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<UserType | null> {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password.");
        }

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error(
            "No account found with that email. Please create an account."
          );
        }

        if (!user.isVerified) {
          await sendEmail({
            email: user.email,
            emailType: "VERIFY",
            userId: user._id.toString(),
          });
          throw new Error(
            "Your account is not verified. A verification email has been sent. Please check your inbox."
          );
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 365, // 1 year (in seconds)
    updateAge: 60 * 60 * 24 * 30, // Update JWT every 30 days
  },

  // session: {
  //   strategy: "jwt",
  //   maxAge: 60, // 1 minute
  //   updateAge: 10, // Refresh JWT every 10 seconds
  // },
  

  callbacks: {
    async signIn({ user }: any) {
      await dbConnect();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        throw new Error("User not found.");
      }

      if (!existingUser.isVerified) {
        await sendEmail({
          email: existingUser.email,
          emailType: "VERIFY",
          userId: existingUser._id,
        });
        throw new Error(
          "Please verify your email before logging in. A verification email has been sent."
        );
      }

      return true;
    },

    async jwt({ token, user }: any) {
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.image = dbUser.avatar;

          // Set long expiry for JWT token
          const oneYearInSeconds = 60 * 60 * 24 * 365; // 1 year
          token.exp = Math.floor(Date.now() / 1000) + oneYearInSeconds;
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        image: token.image,
      };

      // Add expiry details to the session for client reference
      session.expires = new Date(token.exp * 1000).toISOString();
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
