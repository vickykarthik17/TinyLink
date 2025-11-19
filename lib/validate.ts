/**
 * Validates that a code is 6-8 alphanumeric characters.
 * Used for short URL codes like 'abc123' or 'XyZ789'.
 */
export function isValidCode(code: string): boolean {
  const codeRegex = /^[A-Za-z0-9]{6,8}$/;
  return codeRegex.test(code);
}

/**
 * Validates that a URL is properly formatted and uses HTTP/HTTPS.
 * Rejects invalid URLs, FTP, and other non-web protocols.
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const isHttpOrHttps = parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    return isHttpOrHttps;
  } catch (error) {
    // URL constructor throws if URL is invalid
    return false;
  }
}
