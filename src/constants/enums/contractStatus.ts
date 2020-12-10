const contractStatus: { [key: string]: string } = {
  HAVE_CONTRACT:
    'I already have a contract/InterAgency Agreement(IAA) in place',
  IN_PROGRESS:
    'I am currently working on my OAGM Acquisition Plan/IAA documents',
  NOT_STARTED: "I haven't started acquisition planning yet",
  NOT_NEEDED: "I don't anticipate needing contractor support"
};

export default contractStatus;
