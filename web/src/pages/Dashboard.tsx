import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useUser()

  return (
    <div className="space-y-6">
      <SignedOut>
        <section className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 p-6 text-center">
          <h2 className="text-xl font-semibold">Sign in to view your workspace</h2>
          <p className="mt-2 text-muted-foreground">
            Access dashboards, manage designs, and collaborate with your team.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" to="/login">
              Sign in
            </Link>
            <Link className="rounded-md border border-input px-4 py-2 text-sm font-medium" to="/register">
              Create account
            </Link>
          </div>
        </section>
      </SignedOut>

      <SignedIn>
        <section className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!</h1>
          <p className="text-muted-foreground">
            View your recent design requests and manage ongoing projects.
          </p>
        </section>

        <section className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 p-6 text-center">
          <h2 className="text-lg font-medium">No projects yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Get started by creating your first AI generated design brief.
          </p>
          <div className="mt-4 flex justify-center">
            <Link className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" to="/create">
              Create new brief
            </Link>
          </div>
        </section>
      </SignedIn>
    </div>
  )
}

