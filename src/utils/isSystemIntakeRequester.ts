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

  return (
    euaId === intake.requester?.userAccount?.username ||
    euaId === intake.euaUserId
  );
};

export default isSystemIntakeRequester;
