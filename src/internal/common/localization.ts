import { Localizable, LocalizationPOJO } from "../../public";
import { hideAndFreeze } from "./utils";
import { Joi, validate } from "./validation";

const localeSchema = Joi.string().locale();

/**
 * Localizes a localizable object
 */
export function localize<T, P>(pojo: Localizable<T, P>, locale: string): P {
  validate(locale, "locale", localeSchema);
  return pojo.toJSON(locale);
}

const _private = Symbol("private fields");

export class Localization<T extends object> {
  private readonly [_private]: {
    localization: LocalizationPOJO<T>;
  };

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
   * Returns the localization as an object that can be safely serialized as JSON
   */
  public toJSON(): LocalizationPOJO<T> {
    return this[_private].localization;
  }
}


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
