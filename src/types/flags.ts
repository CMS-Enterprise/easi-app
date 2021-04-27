export type Flags = {
  fileUploads: Boolean;
  sandbox: Boolean;
  pdfExport: Boolean;
  prototype508: Boolean;
  prototypeTRB: Boolean;
  downgradeGovTeam: Boolean;
  downgrade508User: Boolean;
  downgrade508Tester: Boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
