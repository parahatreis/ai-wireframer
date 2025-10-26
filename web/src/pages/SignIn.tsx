import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <SignIn routing="path" path="/login" signUpUrl="/register" appearance={{ elements: { card: 'shadow-none' } }} />
      </div>
    </div>
  )
}

