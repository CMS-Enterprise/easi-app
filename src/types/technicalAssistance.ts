export type AttendeeFormFields = {
  id?: string;
  trbRequestId: string;
  userInfo: {
    commonName: string;
    euaUserId: string;
    email?: string;
  } | null;
  component: string;
  role: string;
};
