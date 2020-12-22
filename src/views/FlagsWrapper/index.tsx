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
        clientSideID: process.env.REACT_APP_LD_CLIENT_ID as string
      });
      setLDProvider(() => provider);
    })();
  }, []);

  return <LDProvider>{children}</LDProvider>;
};

export default FlagsWrapper;
