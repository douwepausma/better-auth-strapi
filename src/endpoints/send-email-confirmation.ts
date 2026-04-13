import { createAuthEndpoint } from "better-auth/api";
import { z } from "zod";

import type { StrapiAuthOptions } from "..";

export default function sendEmailConfirmation(options: StrapiAuthOptions) {
    return createAuthEndpoint(
        "/strapi-auth/send-email-confirmation",
        {
            method: "POST",
            body: z.object({
                email: z.email(),
            }),
        },
        async (ctx) => {
            const { email } = ctx.body;
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            if(options.strapiToken) headers.append("Authorization", `Bearer ${options.strapiToken}`);

            console.log("Sending email confirmation for:", email);

            // Send email confirmation
            const strapiResponse = await fetch(
                `${options.strapiUrl}/api/auth/send-email-confirmation`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify({ email }),
                }
            );

            if (!strapiResponse.ok) {
                const errorData = await strapiResponse.json();
                return ctx.error("BAD_REQUEST", errorData.error);
            }

            const data = await strapiResponse.json();
            console.log(data);

            return ctx.json(data);
        }
    )
}