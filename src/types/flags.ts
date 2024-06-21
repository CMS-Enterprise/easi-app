export type Flags = {
  atoProcessList: boolean;
  downgradeGovTeam: boolean;
  downgradeTrbAdmin: boolean;
  systemProfileHiddenFields: boolean;
  systemWorkspace: boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
