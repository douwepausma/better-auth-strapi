import { createAuthEndpoint } from "better-auth/api";
import { z } from "zod";

import type { StrapiAuthOptions } from "..";

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
                console.error("Strapi sign-up error:", errorData);   
                return ctx.error("UNAUTHORIZED", errorData.error);
            }

            const {user, jwt:strapiJwt} = await strapiResponse.json();

            return ctx.json({
                user,
                strapiJwt // Return Strapi JWT for making Strapi API calls
            });
        }
    );
}