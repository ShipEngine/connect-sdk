import { UrlString } from "../../types";

/**
 * A map of BCP 47 language tags and localized values.
 *
 * @see https://tools.ietf.org/html/bcp47
 */
export interface LocalizationPOJO<T extends object> {
  [language: string]: T;
}


/**
 * Localized informational fields that are common to most objects
 * @internal
 */
export interface LocalizedInfoPOJO {
  name?: string;
  description?: string;
}


/**
 * Localized branding fields
 * @internal
 */
export interface LocalizedBrandingPOJO extends LocalizedInfoPOJO {
  websiteURL?: UrlString;
}
