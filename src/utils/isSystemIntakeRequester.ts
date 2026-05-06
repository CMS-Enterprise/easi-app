type RequesterAccessIntake = {
  viewerIsRequester?: boolean | null;
};

type IsSystemIntakeRequesterOptions = {
  intake?: RequesterAccessIntake | null;
};

const isSystemIntakeRequester = ({
  intake
}: IsSystemIntakeRequesterOptions): boolean =>
  intake?.viewerIsRequester === true;

export default isSystemIntakeRequester;
