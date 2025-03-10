import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow specific email addresses
      const allowedEmails = [process.env.ALLOWED_EMAIL];
      if (allowedEmails.includes(user.email!)) {
        return true;
      }
      return false; // Deny access if not in the allowed list
    },
  },
});
