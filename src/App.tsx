import { Authenticated } from "convex/react";
// import { api } from "../convex/_generated/api"; // No longer needed for main display
// import { SignInForm } from "./SignInForm"; // Removed
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import Keyboard from "./Keyboard";

export default function App() {
  // const loggedInUser = useQuery(api.auth.loggedInUser); // No longer needed for main display

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-primary">Keyboard Tester</h2>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <Keyboard />
        {/* Removed loading spinner, welcome message, and unauthenticated message block */}
      </main>
      <Toaster />
    </div>
  );
}
