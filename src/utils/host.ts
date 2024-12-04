// Returns the current browsers address in the format of ${PROTOCOL}//${HOST}
// i.e. https://dev.easi.cms.gov
export default function getWindowAddress(): string {
  return `${window.location.protocol}//${window.location.host}`;
}
