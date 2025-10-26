import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-50 text-zinc-900">
        <header className="p-3 border-b flex justify-between">
          <h1 className="font-semibold">AI Wireframer</h1>
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="p-4">
          <SignedIn>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </SignedIn>
          <SignedOut>
            <SignIn />
          </SignedOut>
        </main>
      </div>
    </BrowserRouter>
  );
}

