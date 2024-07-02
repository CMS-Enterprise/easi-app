import { useSelector } from 'react-redux';
import { useLazyQuery } from '@apollo/client';
import { useFlags } from 'launchdarkly-react-client-sdk';

import {
  BASIC_USER_PROD,
  GOVTEAM_DEV,
  GOVTEAM_PROD,
  TRB_ADMIN_DEV,
  TRB_ADMIN_PROD
} from 'constants/jobCodes';
import GetSystemIntakeGrbReviewersQuery from 'queries/GetSystemIntakeGrbReviewersQuery';
import {
  GetSystemIntakeGrbReviewers,
  GetSystemIntakeGrbReviewersVariables
} from 'queries/types/GetSystemIntakeGrbReviewers';
import { AppState } from 'reducers/rootReducer';

type UseAuthReturn = {
  /**
   * Object with helper functions to check job codes / roles
   *
   * Returns undefined if user is not set
   */
  user:
    | {
        isTrbAdmin: () => boolean;
        isGrtReviewer: () => boolean;
        isBasicUser: () => boolean;
        isGrbReviewer: (systemIntakeId: string) => boolean;
      }
    | undefined;
  /** Returns true if function with query is called and loading */
  loading: boolean;
};

/** Hook that returns functions to check for roles / job codes */
const useAuth = (): UseAuthReturn => {
  const auth = useSelector((state: AppState) => state.auth);
  const { groups, euaId } = auth;

  const flags = useFlags();

  const [getGrbReviewers, { data, called, loading }] = useLazyQuery<
    GetSystemIntakeGrbReviewers,
    GetSystemIntakeGrbReviewersVariables
  >(GetSystemIntakeGrbReviewersQuery);

  const isUserSet = auth.isUserSet && !loading;

  /** Check if user is TRB admin */
  const isTrbAdmin = (): boolean => {
    if (flags.downgradeTrbAdmin) {
      return false;
    }

    if (groups.includes(TRB_ADMIN_DEV) || groups.includes(TRB_ADMIN_PROD)) {
      return true;
    }

    return false;
  };

  /** Check if user is GrtReviewer */
  const isGrtReviewer = (): boolean => {
    if (flags.downgradeGovTeam) {
      return false;
    }

    if (groups.includes(GOVTEAM_DEV) || groups.includes(GOVTEAM_PROD)) {
      return true;
    }

    return false;
  };

  /** Check if basic user */
  const isBasicUser = (): boolean => {
    if (groups.includes(BASIC_USER_PROD)) {
      return true;
    }
    if (groups.length === 0) {
      return true;
    }
    if (!isGrtReviewer() && !isTrbAdmin()) {
      return true;
    }
    return false;
  };

  /** Check if user is set as system intake GRB reviewer */
  const isGrbReviewer = (systemIntakeId: string) => {
    if (!called) {
      getGrbReviewers({
        variables: { id: systemIntakeId }
      });
    }

    const grbReviewers = data?.systemIntake?.grbReviewers;

    if (!grbReviewers || grbReviewers.length === 0) {
      return false;
    }

    return grbReviewers.some(
      ({ userAccount }) => userAccount.username === euaId
    );
  };

  const user: UseAuthReturn['user'] = {
    isTrbAdmin,
    isGrtReviewer,
    isBasicUser,
    isGrbReviewer
  };

  return {
    user: isUserSet || !loading ? user : undefined,
    loading
  };
};

export default useAuth;
