import { LocalizationPOJO } from "../../pojos/common";
import { Joi, validate } from "../../validation";
import { hideAndFreeze } from "../utils";

/**
 * An object that is localizable
 * @internal
 */
export interface Localizable<T, P> {
  /**
   * Creates a copy of the object, localized for the specified locale if possible
   */
  localize(locale: string): T;

  /**
   * Returns the object as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
  toJSON(locale?: string): P;
}

const localeSchema = Joi.string().locale();

/**
 * Localizes a localizable object
 * @internal
 */
export function localize<T, P>(obj: Localizable<T, P>, locale: string): P {
  validate(locale, "locale", localeSchema);
  return obj.toJSON(locale);
}

const _private = Symbol("private fields");

/**
 * A map of BCP 47 language tags and localized values.
 * @internal
 */
export class Localization<T extends object> {
  //#region Private/Internal Fields

  private readonly [_private]: {
    localization: LocalizationPOJO<T>;
  };

  //#endregion

  public constructor(pojo: LocalizationPOJO<T>) {
    this[_private] = {
      localization: pojo,
    };

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Returns the localized fields for the specified language and region.
   *
   * @param locale - a BCP 47 langauge tag, optionally with a region, like "en" or "en-US"
   *
   * @see https://tools.ietf.org/html/bcp47
   */
  public lookup(locale: string): T {
    let { localization } = this[_private];

    // Start with the exact match, if any
    let localizedValues = { ...localization[locale] };

    if (locale.length === 2) {
      // We're only searching by langauge, so fill-in any missing keys using
      // any regional dialect of the language
      for (let regionMatch of getRegionalDialects(localization, locale)) {
        localizedValues = {
          ...regionMatch,
          ...localizedValues,
        };
      }
    }
    else {
      // Fill-in any missing keys with the generic language localization
      let languageMatch = localization[locale.slice(0, 2)];
      if (languageMatch) {
        localizedValues = {
          ...languageMatch,
          ...localizedValues
        };
      }
    }

    return localizedValues;
  }

  /**
   * Returns the localization as a POJO that can be safely serialized as JSON
   */
  public toJSON(): LocalizationPOJO<T> {
    return this[_private].localization;
  }
}

// Prevent modifications to the class
hideAndFreeze(Localization);


/**
 * Returns an array of all localized values for all regional dialects of the specified language.
 * For example, if the langauge is "en", then this will return dialects such as "en-US", "en-GB", etc.
 */
function getRegionalDialects<T extends object>(localization: LocalizationPOJO<T>, language: string) {
  language += "-";
  let matches = [];

  for (let [locale, localizedValues] of Object.entries(localization)) {
    if (locale.startsWith(language)) {
      matches.push(localizedValues);
    }
  }

  return matches;
}
