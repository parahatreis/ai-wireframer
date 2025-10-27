import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <SignIn routing="path" path="/login" signUpUrl="/register" appearance={{ elements: { card: 'shadow-none' } }} />
      </div>
    </div>
  )
}

