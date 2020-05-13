import { InlineOrReference, URLString } from "../types";

/**
 * A map of BCP 47 language tags and localized values.
 *
 * @see https://tools.ietf.org/html/bcp47
 */
export interface LocalizationDefinition<T extends object> {
  [language: string]: InlineOrReference<T>;
}

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
 */
export interface LocalizedInfoPOJO {
  name?: string;
  description?: string;
}


/**
 * Localized branding fields
 */
export interface LocalizedBrandingPOJO extends LocalizedInfoPOJO {
  websiteURL?: URLString;
}
