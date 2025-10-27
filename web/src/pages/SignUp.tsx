import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <SignUp routing="path" path="/register" signInUrl="/login" appearance={{ elements: { card: 'shadow-none' } }} />
      </div>
    </div>
  )
}

