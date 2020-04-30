import { InlineOrReference } from "../../types";

/**
 * A map of BCP 47 language tags and localized values.
 *
 * @see https://tools.ietf.org/html/bcp47
 */
export interface LocalizationDefinition<T extends object> {
  [language: string]: InlineOrReference<T>;
}
