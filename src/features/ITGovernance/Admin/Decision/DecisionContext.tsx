import React from 'react';
import { SystemIntakeLCIDStatus } from 'gql/generated/graphql';
import { DateTime } from 'luxon';

export type LcidTagStatus =
  | SystemIntakeLCIDStatus // e.g., ACTIVE | EXPIRED | RETIRED
  | 'EXPIRING_SOON'
  | 'RETIRING_SOON';

export type DecisionProps = {
  rejectionReason?: string | null;
  decisionNextSteps?: string | null;
  // decisionState is declared in the component file that imports this context
  // to avoid a circular import; the provider caller passes it through
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decisionState: any;
  lcid?: string | null;
  lcidIssuedAt?: string | null;
  lcidExpiresAt?: string | null;
  lcidScope?: string | null;
  lcidCostBaseline?: string | null;
  trbFollowUpRecommendation?: any | null; // same note as above
  lcidStatus?: SystemIntakeLCIDStatus | null;
  lcidRetiresAt?: string | null;
};

type DecisionContextValue = DecisionProps & {
  lcidTagStatus: LcidTagStatus;
};

const DecisionContext = React.createContext<DecisionContextValue | null>(null);

export const useDecision = () => {
  const ctx = React.useContext(DecisionContext);
  if (!ctx) throw new Error('useDecision must be used within DecisionContext');
  return ctx;
};

// Pure helper for easy testing
export function computeLcidTagStatus(
  lcidStatus?: SystemIntakeLCIDStatus | null,
  lcidExpiresAt?: string | null,
  lcidRetiresAt?: string | null
): LcidTagStatus {
  if (!lcidStatus) return SystemIntakeLCIDStatus.ISSUED;

  if (
    lcidStatus === SystemIntakeLCIDStatus.EXPIRED ||
    lcidStatus === SystemIntakeLCIDStatus.RETIRED
  ) {
    return lcidStatus;
  }

  const cutoff = DateTime.now().plus({ days: 60 }).toMillis();

  const retiresAtDT = DateTime.fromISO(lcidRetiresAt ?? '');
  const expiresAtDT = DateTime.fromISO(lcidExpiresAt ?? '');

  const retiresAt = retiresAtDT.isValid
    ? retiresAtDT.toMillis()
    : Number.POSITIVE_INFINITY;
  const expiresAt = expiresAtDT.isValid
    ? expiresAtDT.toMillis()
    : Number.POSITIVE_INFINITY;

  if (expiresAt < cutoff) {
    if (retiresAt < expiresAt) return 'RETIRING_SOON';
    return 'EXPIRING_SOON';
  }

  if (retiresAt < cutoff) return 'RETIRING_SOON';

  return lcidStatus;
}

type DecisionProviderProps = React.PropsWithChildren<DecisionProps>;

export const DecisionProvider = ({
  children,
  ...props
}: DecisionProviderProps) => {
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
};
