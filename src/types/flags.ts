export type Flags = {
  fileUploads: Boolean;
  sandbox: Boolean;
  pdfExport: Boolean;
  prototype508: Boolean;
  prototypeTRB: Boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
