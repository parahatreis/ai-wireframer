const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY. Set it in your environment (see .env.example).')
}

export const clerkPublishableKey = publishableKey

