import React, { useEffect, useState } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

type FlagProviderProps = {
  children: React.ReactNode;
};

// eslint-disable-next-line import/prefer-default-export
export const FlagProvider = ({ children }: FlagProviderProps) => {
  const [LDProvider, setLDProvider] = useState<React.FunctionComponent>(
    () => () => <div />
  );

  useEffect(() => {
    (async () => {
      const provider = await asyncWithLDProvider({
        clientSideID: process.env.REACT_APP_LD_CLIENT_ID as string
      });
      setLDProvider(() => provider);
    })();
  }, []);

  return <LDProvider>{children}</LDProvider>;
};
