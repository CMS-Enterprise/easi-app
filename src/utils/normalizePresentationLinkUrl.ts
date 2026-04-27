export default function normalizePresentationLinkUrl(
  value?: string | null
): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  try {
    const parsedUrl = new URL(trimmedValue);
    const protocol = parsedUrl.protocol.toLowerCase();

    if (!['http:', 'https:'].includes(protocol) || !parsedUrl.host) {
      return null;
    }

    return trimmedValue;
  } catch {
    return null;
  }
}
