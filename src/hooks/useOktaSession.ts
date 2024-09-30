/*
 * Custom hook to manage Okta session state.
 *
 * This hook checks if the user has an existing Okta session and updates the state accordingly.
 * It returns the session state and the Okta authentication object.
 *
 * - `hasSession`: A boolean indicating whether an Okta session exists.
 * - `oktaAuth`: The Okta authentication object for further authentication actions.
 */

import { useEffect, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';

const useOktaSession = () => {
  const { oktaAuth } = useOktaAuth();

  const [hasSession, setHasSession] = useState<boolean | undefined>();

  // Check if user has an existing okta session, if so, sign them in autmatically when clicking 'Sign in'
  useEffect(() => {
    const checkSession = async () => {
      const sessionExists = await oktaAuth.session?.exists();

      setHasSession(sessionExists);
    };

    checkSession();

    // Cleanup
    return () => {
      checkSession();
    };
  }, [oktaAuth]);

  return { hasSession, oktaAuth };
};

export default useOktaSession;
