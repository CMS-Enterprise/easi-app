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

// Compute the "tag status" for an LCID based on its current status and dates
const computeLcidTagStatus = (
  lcidStatus?: SystemIntakeLCIDStatus | null,
  lcidExpiresAt?: string | null,
  lcidRetiresAt?: string | null
): LcidTagStatus => {
  if (!lcidStatus) return SystemIntakeLCIDStatus.ISSUED;

  if (
    lcidStatus === SystemIntakeLCIDStatus.EXPIRED ||
    lcidStatus === SystemIntakeLCIDStatus.RETIRED
  ) {
    return lcidStatus;
  }

  // Define a cutoff timestamp 60 days from now.
  // Anything expiring/retiring before this cutoff counts as "soon".
  const cutoff = DateTime.now().plus({ days: 60 }).toMillis();

  // Parse expiration date from ISO string into a Luxon DateTime.
  // If it's missing/null, we pass an empty string (invalid DateTime).
  const exp = DateTime.fromISO(lcidExpiresAt ?? '');

  // Parse retirement date from ISO string into a Luxon DateTime.
  const ret = DateTime.fromISO(lcidRetiresAt ?? '');

  // Convert expiration date to milliseconds (epoch time).
  // If invalid/missing, treat it as "infinity" so it won't affect comparisons.
  const expMs = exp.isValid ? exp.toMillis() : Number.POSITIVE_INFINITY;

  // Convert retirement date to milliseconds (epoch time).
  // Same "infinity" fallback if invalid.
  const retMs = ret.isValid ? ret.toMillis() : Number.POSITIVE_INFINITY;

  // If expiration date is within 60 days:
  //   - If retirement date is even sooner than expiration, mark as RETIRING_SOON
  //   - Otherwise, mark as EXPIRING_SOON
  if (expMs < cutoff) {
    return retMs < expMs ? 'RETIRING_SOON' : 'EXPIRING_SOON';
  }

  // If retirement date (but not expiration) is within 60 days, mark as RETIRING_SOON
  if (retMs < cutoff) {
    return 'RETIRING_SOON';
  }

  // Otherwise, keep the current LCID status (likely ISSUED).
  return lcidStatus;
};

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
