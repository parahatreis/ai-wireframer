import { ClerkProvider } from '@clerk/clerk-react'
import { RouterProvider } from 'react-router-dom'

import { clerkPublishableKey } from '@/lib/clerk'
import { router } from '@/router'

export function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      routerPush={(to) => router.navigate(to)}
      routerReplace={(to) => router.navigate(to, { replace: true })}
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  )
}

export default App
