import { createContext, useContext } from 'react';

interface SignInContextType {
  isSignedIn: boolean;
}

const SignInContext = createContext<SignInContextType | undefined>(undefined);

function useIsSignedIn(): boolean {
  const context = useContext(SignInContext);
  if (context === undefined) {
    throw new Error('useIsSignedIn must be used within a SignInProvider');
  }
  return context.isSignedIn;
}

function useIsSignedOut() {
  return !useIsSignedIn();
}

export { SignInContext, useIsSignedIn, useIsSignedOut };
export type { SignInContextType };
