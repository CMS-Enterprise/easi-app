import React from 'react';
import {
  SystemIntakeDecisionState,
  SystemIntakeLCIDStatus,
  SystemIntakeTRBFollowUp
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';

export type DecisionProps = {
  rejectionReason?: string | null;
  decisionNextSteps?: string | null;
  decisionState: SystemIntakeDecisionState;
  lcid?: string | null;
  lcidIssuedAt?: string | null;
  lcidExpiresAt?: string | null;
  lcidScope?: string | null;
  lcidCostBaseline?: string | null;
  trbFollowUpRecommendation?: SystemIntakeTRBFollowUp | null;
  lcidStatus?: SystemIntakeLCIDStatus | null;
  lcidRetiresAt?: string | null;
};

type LcidTagStatus = SystemIntakeLCIDStatus | 'EXPIRING_SOON' | 'RETIRING_SOON';

type DecisionContextValue = DecisionProps & {
  lcidTagStatus: LcidTagStatus;
};

const DecisionContext = React.createContext<DecisionContextValue | null>(null);

export const useDecision = () => {
  const ctx = React.useContext(DecisionContext);
  if (!ctx) throw new Error('useDecision must be used within DecisionContext');
  return ctx;
};

function computeLcidTagStatus(
  lcidStatus?: SystemIntakeLCIDStatus | null,
  lcidExpiresAt?: string | null,
  lcidRetiresAt?: string | null
): LcidTagStatus {
  if (!lcidStatus) return SystemIntakeLCIDStatus.ISSUED;
  if (
    lcidStatus === SystemIntakeLCIDStatus.EXPIRED ||
    lcidStatus === SystemIntakeLCIDStatus.RETIRED
  )
    return lcidStatus;

  const cutoff = DateTime.now().plus({ days: 60 }).toMillis();
  const exp = DateTime.fromISO(lcidExpiresAt ?? '');
  const ret = DateTime.fromISO(lcidRetiresAt ?? '');
  const expMs = exp.isValid ? exp.toMillis() : Number.POSITIVE_INFINITY;
  const retMs = ret.isValid ? ret.toMillis() : Number.POSITIVE_INFINITY;

  if (expMs < cutoff) return retMs < expMs ? 'RETIRING_SOON' : 'EXPIRING_SOON';
  if (retMs < cutoff) return 'RETIRING_SOON';
  return lcidStatus;
}

type ProviderProps = React.PropsWithChildren<DecisionProps>;

export function DecisionProvider({ children, ...props }: ProviderProps) {
  const lcidTagStatus = React.useMemo(
    () =>
      computeLcidTagStatus(
        props.lcidStatus,
        props.lcidExpiresAt,
        props.lcidRetiresAt
      ),
    [props.lcidStatus, props.lcidExpiresAt, props.lcidRetiresAt]
  );

  const value = React.useMemo<DecisionContextValue>(
    () => ({ ...props, lcidTagStatus }),
    [props, lcidTagStatus]
  );

  return (
    <DecisionContext.Provider value={value}>
      {children}
    </DecisionContext.Provider>
  );
}
