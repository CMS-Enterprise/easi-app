/**
 * Formats URL to remove http(s) protocol and www prefix
 */
const formatUrl = (url: string) => {
  return url.replace('www.', '').replace(/^https?:\/\//i, '');
};

export default formatUrl;
