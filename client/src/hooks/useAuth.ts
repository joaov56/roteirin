import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { useAuth as useAuthContext } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { LoginData } from "@/services/auth";

export const useAuth = () => {
  const authContext = useAuthContext();
  const router = useRouter();

  const signIn = async (provider: "google" | "instagram" | "credentials", data?: LoginData) => {
    if (provider === "credentials" && data) {
      return authContext.login(data);
    }

    return nextAuthSignIn(provider, { callbackUrl: "/" });
  };

  const signOut = async () => {
    try {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Clear auth context
      authContext.logout();
      
      // Sign out from NextAuth
      await nextAuthSignOut({ 
        redirect: false,
        callbackUrl: "/login"
      });
      
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return {
    ...authContext,
    signIn,
    signOut,
  };
}; 