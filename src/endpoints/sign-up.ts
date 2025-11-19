import { createAuthEndpoint } from "better-auth/api";
import { z } from "zod";

import type { StrapiAuthOptions } from "..";
import { setStrapiSession } from "../lib/session";

export default function signUp(options: StrapiAuthOptions) {
    return createAuthEndpoint(
        "/strapi-auth/sign-up",
        {
            method: "POST",
            body: z.any(),
        },
        async (ctx) => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if(options.strapiToken) headers.append("Authorization", `Bearer ${options.strapiToken}`);

            // Register with Strapi
            const strapiResponse = await fetch(
                `${options.strapiUrl}/api/auth/local/register`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify(ctx.body),
                }
            );

            if (!strapiResponse.ok) {
                const errorData = await strapiResponse.json();
                console.log("Strapi sign-up error:", errorData);   
                return ctx.error("UNAUTHORIZED", errorData.error);
            }

            const strapiSession = await strapiResponse.json();

            // Set session cookie
            const { user, session, strapiJwt } = await setStrapiSession(strapiSession, options, ctx);

            return ctx.json({
                user,
                session,
                strapiJwt // Return Strapi JWT for making Strapi API calls
            });
        }
    );
}