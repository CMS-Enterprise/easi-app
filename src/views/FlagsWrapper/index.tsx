import React, { useEffect, useState } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

type WrapperProps = {
  children: React.ReactNode;
};

const FlagsWrapper = ({ children }: WrapperProps) => {
  // wrapping initial value in function to get around useState and setState thinking
  // the functional component is a function to be evaluated.
  const [LDProvider, setLDProvider] = useState<React.FunctionComponent>(
    () => () => <div />
  );

  // Initializis the LD client without user contexts
  // User contexts are set within UserInfoWrapper
  useEffect(() => {
    (async () => {
      const provider = await asyncWithLDProvider({
        clientSideID: import.meta.env.VITE_LD_CLIENT_ID as string,
        flags: {
          sandbox: true,
          downgradeGovTeam: false,
          downgrade508User: false,
          downgrade508Tester: false,
          downgradeTrbAdmin: false,
          itGovV2Enabled: false,
          systemProfile: true,
          systemProfileHiddenFields: false,
          cedar508Requests: false,
          technicalAssistance: true,
          hide508Workflow: true,
          serviceAlertEnabled: false
        }
      });

      setLDProvider(() => () => provider({ children }));
    })();
  }, [children]);

  return <LDProvider>{children}</LDProvider>;
};

export default FlagsWrapper;
