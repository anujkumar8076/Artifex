import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

const providers: NextAuthConfig["providers"] = [];

// Only register GitHub when configured, so the app builds + runs without auth.
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  );
}

export const authConfig: NextAuthConfig = {
  providers,
  session: { strategy: "jwt" },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export function isAuthConfigured(): boolean {
  return !!(process.env.AUTH_SECRET && process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET);
}

/** Safe session getter — never throws if auth isn't configured. */
export async function getSessionSafe() {
  try {
    return await auth();
  } catch {
    return null;
  }
}
