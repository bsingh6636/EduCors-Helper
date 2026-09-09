import { lookup as dnsLookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import ipaddr from 'ipaddr.js';

function badTarget(message) {
  return Object.assign(new Error(message), { statusCode: 400 });
}
export function isPublicAddress(address) {
  try {
    let parsed = ipaddr.parse(address.replace(/^\[|\]$/g, ''));
    if (parsed.kind() === 'ipv6' && parsed.isIPv4MappedAddress())
      parsed = parsed.toIPv4Address();
    return parsed.range() === 'unicast';
  } catch {
    return false;
  }
}
export function parseTarget(target) {
  if (typeof target !== 'string' || target.length > 4096)
    throw badTarget('Enter a valid target URL.');
  let url;
  try {
    url = new URL(target);
  } catch {
    throw badTarget('Enter a valid target URL.');
  }
  if (!['http:', 'https:'].includes(url.protocol))
    throw badTarget('Only HTTP and HTTPS URLs are supported.');
  if (url.username || url.password)
    throw badTarget(
      'Credentials in target URLs are not supported. Use an Authorization header.',
    );
  if (url.port && !['80', '443'].includes(url.port))
    throw badTarget('Only standard HTTP and HTTPS ports are supported.');
  const hostname = url.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    (!hostname.includes('.') && !isIP(hostname))
  ) {
    throw badTarget('Private, local, and internal addresses are blocked.');
  }
  if (isIP(hostname) && !isPublicAddress(hostname))
    throw badTarget('Private, local, and internal addresses are blocked.');
  url.hash = '';
  return url;
}
export async function resolveTarget(url, resolver = dnsLookup) {
  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  let addresses, timeout;
  try {
    addresses = isIP(hostname)
      ? [{ address: hostname, family: isIP(hostname) }]
      : await Promise.race([
          resolver(hostname, { all: true, verbatim: true }),
          new Promise((resolve, reject) => {
            timeout = setTimeout(() => reject(new Error('DNS timeout')), 5000);
          }),
        ]);
  } catch {
    throw Object.assign(
      new Error('The target hostname could not be resolved.'),
      { statusCode: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
  if (
    !addresses.length ||
    addresses.some((item) => !isPublicAddress(item.address))
  ) {
    throw badTarget(
      'The target resolves to a private or reserved network address.',
    );
  }
  // The HTTP agents use these already-validated addresses, avoiding a second DNS lookup.
  return (hostname, options, callback) => {
    const family = typeof options === 'number' ? options : options?.family;
    const matching = family
      ? addresses.filter((item) => item.family === family)
      : addresses;
    if (!matching.length)
      return callback(new Error('No public address for this address family.'));
    if (typeof options === 'object' && options.all)
      return callback(null, matching);
    callback(null, matching[0].address, matching[0].family);
  };
}
