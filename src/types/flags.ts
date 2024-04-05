export type Flags = {
  downgradeGovTeam: boolean;
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
