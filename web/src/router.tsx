import { createBrowserRouter, Outlet, useLocation, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

import Layout from '@/components/Layout'
import CreatePage from '@/pages/Create'
import Dashboard from '@/pages/Dashboard'
import SignInPage from '@/pages/SignIn'
import SignUpPage from '@/pages/SignUp'

function ProtectedLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SignedIn>
        <Outlet />
      </SignedIn>
      <SignedOut>
        <Navigate to={`/login?redirect_url=${encodeURIComponent(`${location.pathname}${location.search}`)}`} replace />
      </SignedOut>
    </div>
  )
}

export const router = createBrowserRouter([
  // Public routes
  { path: '/login/*', element: <SignInPage /> },
  { path: '/register/*', element: <SignUpPage /> },
  { path: '/create', element: <CreatePage /> },
  // Legacy auth redirects
  { path: '/sign-in/*', element: <Navigate to="/login" replace /> },
  { path: '/sign-up/*', element: <Navigate to="/register" replace /> },

  {
    element: <ProtectedLayout />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: ':id', element: <Dashboard /> },
        ],
      },
    ],
  },
])
