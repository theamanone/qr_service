import { useSession, signIn } from "next-auth/react";

export const refreshSession = async () => {
  await signIn("credentials", undefined, {
    callbackUrl: window.location.href,
  });
};
