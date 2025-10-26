import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <SignUp routing="path" path="/register" signInUrl="/login" appearance={{ elements: { card: 'shadow-none' } }} />
      </div>
    </div>
  )
}

