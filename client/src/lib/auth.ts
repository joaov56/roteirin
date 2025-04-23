import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "instagram") {
        try {
          // Check if user exists in our database
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/check-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          });

          const data = await response.json();

          if (!data.exists) {
            // If user doesn't exist, redirect to registration page with social data
            return `/register?email=${user.email}&name=${user.name}&provider=${account.provider}`;
          }

          // If user exists, authenticate with our backend
          const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/social-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              provider: account.provider,
              accessToken: account.access_token,
            }),
          });

          if (!authResponse.ok) {
            throw new Error("Failed to authenticate with backend");
          }

          const authData = await authResponse.json();

          // Store the token in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("token", authData.token);
            localStorage.setItem("user", JSON.stringify(authData.user));
          }

          return true;
        } catch (error) {
          console.error("Error during social login:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          provider: account.provider,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        provider: token.provider,
      };
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST }; 