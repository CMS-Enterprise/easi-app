export type Flags = {
  downgradeGovTeam: boolean;
  downgrade508User: boolean;
  downgrade508Tester: boolean;
  downgradeTrbAdmin: boolean;
  systemProfileHiddenFields: boolean;
  itgovLinkRequestsRequester: boolean;
  itgovLinkRequestsAdmin: boolean;
  trbLinkRequestsRequester: boolean;
  trbLinkRequestsAdmin: boolean;
  systemWorkspace: boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
