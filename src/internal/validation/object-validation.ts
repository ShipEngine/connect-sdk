import * as joi from "@hapi/joi";
import { regex } from "../utils";

/**
 * Extended Joi object validation schema
 * @internal
 */
export interface ObjectValidationSchema extends joi.ObjectSchema {
  /**
   * Requires the object to be a map of BCP 47 language tags and localized values
   */
  localization(keys?: Record<string, joi.Schema>): ObjectValidationSchema;

  /**
   * Requires an object value to be a valid HTTP or HTTPS URL
   */
  website(): ObjectValidationSchema;
}


/**
 * Joi object validation extensions
 * @internal
 */
export const objectValidation: joi.Extension = {
  type: "object",
  base: joi.object(),
  messages: {
    "object.localization": '{{#label}} can only contain language codes, like "en" or "en-US"',
    "object.website": "{{#label}} must be a URL",
    "object.websiteProtocol": "{{#label}} must be an HTTP or HTTPS URL",
  },
  rules: {
    localization: {
      method(keys?: Record<string, joi.Schema>) {
        let schema = (this as ObjectValidationSchema).pattern(joi.string(), joi.object(keys));
        return schema.$_addRule("localization");
      },
      validate(value: object, helpers: joi.CustomHelpers) {
        for (let lang of Object.keys(value)) {
          if (!regex.locale.test(lang)) {
            return helpers.error("object.localization", { lang });
          }
        }
        return value;
      },
    },
    website: {
      validate(value: object, helpers: joi.CustomHelpers) {
        if (value instanceof URL) {
          if (value.protocol !== "http:" && value.protocol !== "https:") {
            return helpers.error("object.websiteProtocol");
          }
        }
        else {
          return helpers.error("object.website");
        }
      },
    },
  }
};
