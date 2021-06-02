export type Flags = {
  fileUploads: boolean;
  sandbox: boolean;
  pdfExport: boolean;
  prototype508: boolean;
  prototypeTRB: boolean;
  downgradeGovTeam: boolean;
  downgrade508User: boolean;
  downgrade508Tester: boolean;
  add508Request: boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
