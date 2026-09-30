import { API_BASE_URL, BASE_URL_PREFIX, ORIGIN } from '@config';
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

export const localApi = (...parts: string[]): string => {
  const urlParts = [BASE_URL_PREFIX, ...parts];
  return urlParts.map(pathPart => pathPart.replace(/(\/$)/g, '')).join('/');
};

export const apiURL = (...parts: string[]): string => {
  const urlParts = [API_BASE_URL, ...parts];
  //const urlParts = ['http://localhost:8000', ...parts];
  return urlParts.map(pathPart => pathPart.replace(/(^\/|\/$)/g, '')).join('/');
};

export const luhnCheck = (str = ''): boolean => {
  let sum = 0;
  //str += '';

  for (let i = 0, l = str.length; i < l; i++) {
    let v = parseInt(str[i]);
    v *= 2 - (i % 2);
    if (v > 9) {
      v -= 9;
    }
    sum += v;
  }

  return sum % 10 === 0;
};

export enum OrgNumberFormat {
  DASH,
}

export const formatOrgNr = (orgNr: string, format: OrgNumberFormat = OrgNumberFormat.DASH): string | undefined => {
  const orgNumber = orgNr.replace(/\D/g, '');
  if (orgNumber.length !== 10 || !luhnCheck(orgNumber)) {
    return; // NOTE: incorrect org number
  }
  return format === OrgNumberFormat.DASH ? orgNumber.substring(0, 6) + '-' + orgNumber.substring(6, 10) : orgNumber;
};

export const isValidUrl = (string: string) => {
  let url;
  try {
    url = new URL(string);
  } catch {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};

/** Returns the url if it points to our own frontend (ORIGIN), otherwise the fallback. */
export const safeRedirectUrl = (url: unknown, fallback = ORIGIN): string => {
  if (typeof url !== 'string' || !isValidUrl(url)) {
    return fallback;
  }
  const allowed = new URL(ORIGIN);
  const target = new URL(url);
  if (target.origin !== allowed.origin) {
    return fallback;
  }
  // Rebuild from the trusted origin so only path, query and hash come from the input
  return `${allowed.origin}${target.pathname}${target.search}${target.hash}`;
};
