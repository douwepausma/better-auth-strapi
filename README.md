# Better Auth + Strapi

A [Better Auth](https://better-auth.com) plugin that enables authentication using [Strapi](https://strapi.io) as the backend.

## Features

- 🔐 Sign in with Strapi credentials
- 📝 User registration through Strapi
- 🔑 Password reset and update functionality
- 🎣 Custom session hooks for extended user data
- 🔄 Seamless integration with Better Auth
- 📦 TypeScript support with full type safety

## Installation

```bash
npm install better-auth-strapi
```

## Usage

### Server Setup

Configure the plugin in your Better Auth server configuration:

```typescript
import { betterAuth } from "better-auth";
import { strapiAuth } from "better-auth-strapi";

export const auth = betterAuth({
  // ... your other Better Auth config
  plugins: [
    strapiAuth({
      strapiUrl: "http://localhost:1337", // Your Strapi instance URL
      strapiToken: process.env.STRAPI_API_TOKEN, // Optional: API token for authenticated requests
      signInAfterReset: true, // Optional: Auto sign-in after password reset
      userFieldsMap: {
        // Optional: Map additional Strapi user fields
        firstName: "firstName",
        lastName: "lastName",
        image: "avatar.url"
      },
      sessionHook: async ({ session, user }) => {
        // Optional: Extend session with custom data
        return {
          ...session,
          customData: "value",
        };
      },
    }),
  ],
});
```

### Client Setup

Add the client plugin to your Better Auth client:

```typescript
import { createAuthClient } from "better-auth/client";
import { strapiAuthClient } from "better-auth-strapi/client";

export const authClient = createAuthClient({
  plugins: [strapiAuthClient()],
});
```

### Authentication Methods

#### Sign Up

```typescript
const { data, error } = await authClient.strapiAuth.signUp({
  email: "user@example.com",
  password: "securePassword123",
});
```

#### Sign In

```typescript
const { data, error } = await authClient.strapiAuth.signIn({
  identifier: "user@example.com", // Email or username
  password: "securePassword123",
});

// The response includes the Strapi JWT for making authenticated Strapi API calls
if (data) {
  console.log(data.strapiJwt); // Use this for Strapi API requests
}
```

#### Forgot Password

```typescript
const { data, error } = await authClient.strapiAuth.forgotPassword({
  email: "user@example.com",
});
```

#### Update Password

```typescript
const { data, error } = await authClient.strapiAuth.updatePassword({
  code: "reset-code-from-email",
  password: "newSecurePassword123",
  passwordConfirmation: "newSecurePassword123",
});
```

## Configuration Options

### `StrapiAuthOptions`

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `strapiUrl` | `string` | Yes | Base URL of your Strapi instance |
| `strapiToken` | `string` | No | API token for authenticated Strapi requests |
| `userFieldsMap` | `object` | No | Map additional Strapi user fields to Better Auth user object |
| `signInAfterReset` | `boolean` | No | Automatically sign in users after password reset (default: `false`) |
| `sessionHook` | `function` | No | Custom function to extend session data with additional information |

## Endpoints

The plugin provides the following authentication endpoints:

- `POST /strapi-auth/sign-in` - Authenticate with Strapi credentials
- `POST /strapi-auth/sign-up` - Register a new user via Strapi
- `POST /strapi-auth/forgot-password` - Request password reset
- `POST /strapi-auth/update-password` - Reset password with code

## Strapi Setup

Ensure your Strapi instance has the following enabled:

1. **Users & Permissions plugin** (enabled by default)
2. **Email plugin** configured for password reset emails
3. Access to authentication endpoints:
   - `/api/auth/local` (sign in)
   - `/api/auth/local/register` (sign up)
   - `/api/auth/forgot-password` (forgot password)
   - `/api/auth/reset-password` (reset password)

## TypeScript Support

This plugin is written in TypeScript and provides full type definitions. All configuration options and API responses are fully typed.

## License

MIT

## Author

[@douweapausma](https://github.com/douweapausma)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- [Better Auth Documentation](https://better-auth.com)
- [Strapi Documentation](https://docs.strapi.io)
