import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

// typed credentials input
interface CredentialsInput {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        name: { label: "Name", type: "text", placeholder: "John Doe" },
        email: { label: "Email", type: "email" },
        phone: { label: "Phone number", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(rawCreds): Promise<any | null> {
        const credentials = rawCreds as CredentialsInput;

        if (!credentials?.phone || !credentials?.password) return null;

        // ----- EXISTING USER -----
        const existingUser = await db.user.findFirst({
          where: { number: credentials.phone },
        });

        if (existingUser) {
          const passwordValid = await bcrypt.compare(
            credentials.password,
            existingUser.password ?? ""
          );

          if (passwordValid) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email ?? existingUser.number,
            };
          }

          return null;
        }

        // ----- REGISTER USER -----
        if (!credentials?.name || !credentials?.email) return null;

        const hashedPassword = await bcrypt.hash(credentials.password, 10);

        const user = await db.user.create({
          data: {
            name: credentials.name,
            email: credentials.email,
            number: credentials.phone,
            password: hashedPassword,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  secret: process.env.JWT_SECRET || "secret",

  pages: {
    signIn: "/signin",
  },

  callbacks: {
    // attach DB id to JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },

    // attach id to session.user safely
    async session({ session, token }) {
      // ensure session.user exists
      if (!session.user) {
        session.user = {
          name: null,
          email: null,
        } as any;
      }

      // safe assignment + satisfies TS
      if (token?.id) {
        (session.user as any).id = token.id;
      }

      return session;
    },

    // handle first-time Google login
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existingUser = await db.user.findFirst({
          where: { email: user.email! },
        });

        if (!existingUser) {
          await db.user.create({
            data: {
              name: user.name!,
              email: user.email!,
              number: user.email!, // fallback
              password: "",
            },
          });
        }
      }
      return true;
    },
  },
};

