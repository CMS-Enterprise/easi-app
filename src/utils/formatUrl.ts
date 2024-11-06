/**
 * Formats URL to remove http(s) protocol and www prefix
 */
const formatUrl = (url: string) => {
  return url.replace('www.', '').replace(/^https?:\/\//i, '');
};

export default formatUrl;

/**
 * Add `https` prefix to urls without any http prefix
 */
export function formatHttpsUrl(url: string): string {
  if (/^https?/.test(url)) {
    return url;
  }
  return `https://${url}`;
}
