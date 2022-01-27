const scrollBlackList = ['system-profile'];

const shouldScroll = (path: string) =>
  !scrollBlackList.includes(path.split('/')[1]); // Checking for only first path as possible blacklist, as subsequent paths contain variable ids

export default shouldScroll;
