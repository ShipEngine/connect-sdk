import * as joi from "@hapi/joi";

/**
 * Extended Joi object validation schema
 */
export interface ObjectValidationSchema extends joi.ObjectSchema {
  /**
   * Requires an object value to be a valid HTTP or HTTPS URL
   */
  website(): ObjectValidationSchema;
}


/**
 * Joi object validation extensions
 */
export const objectValidation: joi.Extension = {
  type: "object",
  base: joi.object(),
  messages: {
    "object.website": "{{#label}} must be a URL",
    "object.websiteProtocol": "{{#label}} must be an HTTP or HTTPS URL",
  },
  rules: {
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
