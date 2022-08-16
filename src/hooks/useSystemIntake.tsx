import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';

/** Custom hook to retrieve system intake - returns cached data if available */
export default function useSystemIntake(id: string) {
  const { loading, data, refetch } = useQuery<
    GetSystemIntake,
    GetSystemIntakeVariables
  >(GetSystemIntakeQuery, {
    fetchPolicy: 'cache-first',
    variables: {
      id
    }
  });

  const systemIntake = useMemo(() => {
    if (!data?.systemIntake) return undefined;
    return data?.systemIntake;
  }, [data?.systemIntake]);

  return {
    systemIntake,
    loading,
    refetch
  };
}
