import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import GetCurrentUserQuery from 'queries/GetCurrentUserQuery';
import { GetCurrentUser } from 'queries/types/GetCurrentUser';

type FlagsWrapperProps = {
  children: React.ReactNode;
};

const FlagsWrapper = ({ children }: FlagsWrapperProps) => {
  // wrapping initial value in function to get around useState and setState thinking
  // the functional component is a function to be evaluated.
  const [LDProvider, setLDProvider] = useState<React.FunctionComponent>(
    () => () => <div />
  );

  const { data } = useQuery<GetCurrentUser>(GetCurrentUserQuery);
  let key = process.env.REACT_APP_LD_ENV_USER;
  let anonymous = true;
  let hash: string | undefined;

  if (data) {
    key = data.currentUser?.userKey;
    hash = data.currentUser?.signedHash;
    anonymous = false;
  }

  useEffect(() => {
    (async () => {
      const provider = await asyncWithLDProvider({
        clientSideID: process.env.REACT_APP_LD_CLIENT_ID as string,
        user: {
          anonymous,
          key
        },
        options: {
          hash
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
          add508Request: false
        }
      });
      setLDProvider(() => provider);
    })();
  }, [key, hash, anonymous]);

  return <LDProvider>{children}</LDProvider>;
};

export default FlagsWrapper;
