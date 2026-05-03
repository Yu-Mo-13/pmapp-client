const ABSOLUTE_URL_PROTOCOL_PATTERN = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

export const resolveLoginRedirectTarget = (
  redirectParam: string | null | undefined,
  origin?: string
): string | null => {
  if (typeof redirectParam !== 'string') {
    return null;
  }

  const trimmed = redirectParam.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('/')) {
    return trimmed.startsWith('//') ? null : trimmed;
  }

  if (!origin || !ABSOLUTE_URL_PROTOCOL_PATTERN.test(trimmed)) {
    return null;
  }

  try {
    const targetUrl = new URL(trimmed);
    const currentOrigin = new URL(origin).origin;

    if (targetUrl.origin !== currentOrigin) {
      return null;
    }

    return `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`;
  } catch {
    return null;
  }
};
