import React, { useEffect, useRef } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

type FlagProviderProps = {
  children: React.ReactNode;
};

// eslint-disable-next-line import/prefer-default-export
export const FlagProvider = ({ children }: FlagProviderProps) => {
  const LDProviderRef = useRef<React.FunctionComponent>(() => <div />);

  const testFN = async () => {
    console.log('start');
    LDProviderRef.current = await asyncWithLDProvider({
      clientSideID: process.env.REACT_APP_LD_CLIENT_ID as string
    });
    console.log('end');
  };
  useEffect(() => {
    testFN();
  }, []);

  const LDProvider = LDProviderRef.current;
  return <LDProvider>{children}</LDProvider>;
};
