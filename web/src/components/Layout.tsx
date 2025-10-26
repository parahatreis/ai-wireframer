import { Link, NavLink, Outlet } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
  }`

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-semibold">
            AI Designer
          </Link>

          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navLinkClassName} end>
              Dashboard
            </NavLink>
            <NavLink to="/create" className={navLinkClassName}>
              Create
            </NavLink>

            <SignedIn>
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
            </SignedIn>
            <SignedOut>
              <Link
                to="/login"
                className="rounded-md border border-input px-3 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Sign in
              </Link>
            </SignedOut>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}

