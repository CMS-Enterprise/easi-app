type RequesterAccessIntake = {
  euaUserId?: string | null;
  requester?: {
    userAccount?: {
      username?: string | null;
    } | null;
  } | null;
};

type IsSystemIntakeRequesterOptions = {
  euaId?: string | null;
  intake?: RequesterAccessIntake | null;
  isUserSet: boolean;
};

const isSystemIntakeRequester = ({
  euaId,
  intake,
  isUserSet
}: IsSystemIntakeRequesterOptions): boolean => {
  if (!isUserSet || !euaId || !intake) {
    return false;
  }

  const requesterUsername = intake.requester?.userAccount?.username;

  if (requesterUsername) {
    return euaId === requesterUsername;
  }

  return euaId === intake.euaUserId;
};

export default isSystemIntakeRequester;
