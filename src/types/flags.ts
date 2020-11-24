export type Flags = {
  taskListLite: Boolean;
  sandbox: Boolean;
  pdfExport: Boolean;
  prototype508: Boolean;
  prototypeTRB: Boolean;
  fileUploads: Boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
