import type { InlineOrReference, URLString } from "./types";

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


/**
 * An object that is localizable
 */
export interface Localizable<T, P> {
  /**
   * Creates a copy of the object, localized for the specified locale if possible.
   */
  localize(locale: string): T;

  /**
   * Returns a copy of the object that can be safely serialized as JSON.
   * Optionally returns the object localized to the specifeid language and region.
   */
  toJSON(locale?: string): P;
}
