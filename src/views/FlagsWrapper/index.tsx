import React, { useEffect, useState } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

type FlagsWrapperProps = {
  children: React.ReactNode;
};

const FlagsWrapper = ({ children }: FlagsWrapperProps) => {
  // wrapping initial value in function to get around useState and setState thinking
  // the functional component is a function to be evaluated.
  const [LDProvider, setLDProvider] = useState<React.FunctionComponent>(
    () => () => <div />
  );

  useEffect(() => {
    (async () => {
      const provider = await asyncWithLDProvider({
        clientSideID: process.env.REACT_APP_LD_CLIENT_ID as string,
        user: {
          anonymous: true,
          key: process.env.REACT_APP_LD_ENV_USER
        },
        options: {
          hash: process.env.REACT_APP_LD_USER_HASH
        },
        flags: {
          sandbox: true,
          pdfExport: true,
          prototype508: true,
          fileUploads: true,
          prototypeTRB: true,
          downgradeGovTeam: false,
          downgrade508User: false,
          downgrade508Tester: false,
          add508Request: false,
          access508Flow: false
        }
      });
      setLDProvider(() => provider);
    })();
  }, []);

  return <LDProvider>{children}</LDProvider>;
};

export default FlagsWrapper;
