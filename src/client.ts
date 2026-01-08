import { BetterAuthClientPlugin } from "better-auth/client";
import type { StrapiAuth } from "./index.ts";
import { createAuthClient } from "better-auth/client";

export const strapiAuthClient = () => {
  return {
    id: "strapi-auth",
    $InferServerPlugin: {} as StrapiAuth,
  } satisfies BetterAuthClientPlugin;
};

// Test usage:
const client = createAuthClient({
  plugins: [strapiAuthClient()],
})

const _x = await client.strapiAuth.resetPassword({ email: ""});
