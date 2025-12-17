import { createAuthEndpoint } from "better-auth/api";
import { z } from "zod";

import type { StrapiAuthOptions } from "..";
import { setStrapiSession } from "../lib/session";

export default function updatePassword(options: StrapiAuthOptions) {
    return createAuthEndpoint(
        "/strapi-auth/update-password",
        {
            method: "POST",
            body: z.object({
                code: z.string(),
                password: z.string(),
                passwordConfirmation: z.string(),
            }),
        },
        async (ctx) => {
            const { code, password, passwordConfirmation } = ctx.body;
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if(options.strapiToken) headers.append("Authorization", `Bearer ${options.strapiToken}`);

            // Authenticate with Strapi
            const strapiResponse = await fetch(
                `${options.strapiUrl}/api/auth/reset-password`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ code, password, passwordConfirmation }),
                }
            );

            if (!strapiResponse.ok) {
                const errorData = await strapiResponse.json();
                return ctx.error("BAD_REQUEST", errorData.error);
            }

            const strapiSession = await strapiResponse.json();

            // Set session cookie
            if(options.signInAfterReset && strapiSession.user.confirmed) {
                const { user, session, strapiJwt } = await setStrapiSession(strapiSession, options, ctx);

                return ctx.json({ user, session, strapiJwt });
            }

            return ctx.json(strapiSession);
        }
    )
}