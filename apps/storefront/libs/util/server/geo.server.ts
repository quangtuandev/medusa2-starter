import { config } from './config.server';

const VND_CURRENCY = 'vnd';

const isProduction = config.NODE_ENV === 'production';

/** Dev-only country override (e.g. DEV_FORCE_COUNTRY=US) for testing without Cloudflare. Ignored in production. */
const devForcedCountry = !isProduction && config.DEV_FORCE_COUNTRY ? config.DEV_FORCE_COUNTRY.toUpperCase() : null;

/** Country code (ISO 3166-1 alpha-2, uppercase) set by Cloudflare's IP Geolocation, or null when absent. */
export const getRequestCountry = (headers: Headers) =>
  devForcedCountry ?? headers.get('cf-ipcountry')?.toUpperCase() ?? null;

/**
 * VND prices are only shown to visitors located in Vietnam. A missing header is treated as
 * "outside Vietnam", except outside production so local development keeps working.
 */
export const canViewVndPrices = (headers: Headers) =>
  (!isProduction && !devForcedCountry) || getRequestCountry(headers) === 'VN';

export const isVndRegion = (region?: { currency_code?: string | null } | null) =>
  region?.currency_code?.toLowerCase() === VND_CURRENCY;

export const isRegionAllowed = (headers: Headers, region?: { currency_code?: string | null } | null) =>
  !isVndRegion(region) || canViewVndPrices(headers);

export const filterAllowedRegions = <T extends { currency_code?: string | null }>(headers: Headers, regions: T[]) =>
  regions.filter((region) => isRegionAllowed(headers, region));
