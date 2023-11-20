export default function extractTextContent(html: string) {
  return new DOMParser().parseFromString(html, 'text/html').documentElement
    .textContent;
}
