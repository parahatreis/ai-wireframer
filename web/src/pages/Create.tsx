import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

export default function CreatePage() {
  return (
    <div className="space-y-6">
      <SignedOut>
        <section className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 p-6 text-center">
          <h2 className="text-xl font-semibold">Sign in to create a project</h2>
          <p className="mt-2 text-muted-foreground">
            You need an account to create AI design briefs and collaborate with your team.
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
          <h1 className="text-3xl font-semibold tracking-tight">Create a new design brief</h1>
          <p className="text-muted-foreground">
            Describe the project you want the AI designer to work on. We&apos;ll guide you through the process.
          </p>
        </section>

        <section className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/40 p-6">
          <p className="text-sm text-muted-foreground">
            Form components coming soon.
          </p>
        </section>
      </SignedIn>
    </div>
  )
}

