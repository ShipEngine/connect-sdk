import * as joi from "@hapi/joi";
import * as path from "path";
import { ParsedPath } from "path"; // tslint:disable-line: no-duplicate-imports
import { _internal } from "./classes/utils";
import { error, ErrorCode } from "./errors";
import { ShipEngineConstructor } from "./internal-types";

const joiOptions = {
  abortEarly: false,
  convert: false,
  allowUnknown: false,
  errors: {
    wrap: {
      label: false,
      array: false,
    }
  }
};

const isoDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/;
const appName = /^\@[a-z][a-z0-9]*(-[a-z0-9]+)*\/[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const semver = /^\d+\.\d+\.\d+/;
const money = /^\d+(\.\d+)?$/;
const protocol = /^https?:\/\//;
const locale = /^[a-z]{2}(-[A-Z]{2})?$/;

/**
 * Validates a value against a Joi schema. If validation fails, an error is thrown.
 * @internal
 */
export function validate(value: unknown, type: ShipEngineConstructor, schema?: ValidationSchema): void;
export function validate(value: unknown, type: string, schema: ValidationSchema): void;

export function validate(value: unknown, arg2: ShipEngineConstructor | string, arg3?: ValidationSchema): void {
  let label = typeof arg2 === "string" ? arg2 : arg2[_internal].label;
  let schema = arg3 || (arg2 as ShipEngineConstructor)[_internal].schema;

  if (value === undefined || value === null) {
    throw error(ErrorCode.Validation, `Invalid ${label}: \n  A value is required`);
  }

  let result = schema.validate(value, joiOptions as joi.ValidationOptions);

  if (result.error) {
    throw error(
      ErrorCode.Validation,
      `Invalid ${label}: \n  ` + result.error.details.map((detail) => detail.message).join(" \n  "),
    );
  }
}

/**
 * A Joi validation schema, with our custom extensions
 * @internal
 */
export type ValidationSchema = joi.Schema | StringValidationSchema;

/**
 * The Joi validation library, with our custom extensions
 * @internal
 */
export interface JoiExtended extends joi.Root {
  /**
   * Requires a string value
   */
  string(): StringValidationSchema;

  /**
   * Requires an object value
   */
  object(keys?: object): ObjectValidationSchema;
}

/**
 * Extended Joi string validation schema
 * @internal
 */
export interface StringValidationSchema extends joi.StringSchema {
  /**
   * Requires a string value to be a single-line (no newlines, carriage returns, or tabs)
   */
  singleLine(): StringValidationSchema;

  /**
   * Requires a string value to specify a complete ISO 8601 date and time (e.g. 2005-05-15T05:05:05.005Z)
   */
  isoDateTime(): StringValidationSchema;

  /**
   * Requires a string value to be a scoped NPM package name (e.g. "@company/app-name")
   */
  appName(): StringValidationSchema;

  /**
   * Requires a string value to be a valid SemVer version number.
   */
  semver(): StringValidationSchema;

  /**
   * Requires a string value to be a valid monetary value (e.g. ##.##)
   */
  money(): StringValidationSchema;

  /**
   * Requires a string value to be one of the specified enumeration's values
   */
  enum(enumeration: Record<string, string>): StringValidationSchema;

  /**
   * Requires a string value to be a valid HTTP or HTTPS URL
   */
  website(): StringValidationSchema;

  /**
   * Requires a string value to be a valid BCP 47 language tag
   */
  locale(): StringValidationSchema;

  /**
   * Requires a string value to be a valid filesystem path, optionally with additional criteria
   */
  filePath(criteria: Partial<ParsedPath>): StringValidationSchema;
}

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
  website(): StringValidationSchema;
}

/**
 * The Joi validation schema, with our custom extensions
 * @internal
 */
// tslint:disable-next-line: variable-name
export const Joi = joi.extend(
  {
    type: "string",
    base: joi.string(),
    messages: {
      "string.singleLine": "{{#label}} cannot contain newlines or tabs",
      "string.isoDateTime": "{{#label}} must be a complete ISO 8601 date and time, like 2005-09-23T17:30:00.000Z",
      "string.appName": '{{#label}} must be a scoped NPM package name, like "@company-name/app-name"',
      "string.semver": "{{#label}} must be a version number, like 1.23.456",
      "string.money": "{{#label}} must be a monetary value, like ##.##",
      "string.website": "{{#label}} must be a valid website URL",
      "string.websiteIncomplete": '{{#label}} must be a complete website URL, including "http://" or "https://"',
      "string.locale": '{{#label}} must be a valid language code, like "en" or "en-US"',
      "string.filePathRelative": "{{#label}} must be an absolute file path",
      "string.filePathExtension": "{{#label}} must be a {{#ext}} file",
    },
    rules: {
      singleLine: {
        validate(value: string, helpers: joi.CustomHelpers) {
          const multiline =  /\n|\r|\t/;
          if (multiline.test(value)) {
            return helpers.error("string.singleLine");
          }
          return value;
        },
      },
      isoDateTime: {
        validate(value: string, helpers: joi.CustomHelpers) {
          if (!isoDateTime.test(value) || isNaN(new Date(value).getTime())) {
            return helpers.error("string.isoDateTime");
          }
          return value;
        },
      },
      appName: {
        validate(value: string, helpers: joi.CustomHelpers) {
          if (!appName.test(value)) {
            return helpers.error("string.appName");
          }
          return value;
        },
      },
      semver: {
        validate(value: string, helpers: joi.CustomHelpers) {
          if (!semver.test(value)) {
            return helpers.error("string.semver");
          }
          return value;
        },
      },
      money: {
        validate(value: string, helpers: joi.CustomHelpers) {
          if (!money.test(value)) {
            return helpers.error("string.money");
          }
          return value;
        },
      },
      enum: {
        method(enumeration: Record<string, string>) {
          let valids = Object.values(enumeration);
          return this.$_addRule({ name: "enum", args: { valids }});
        },
        validate(value: string, helpers: joi.CustomHelpers, { valids }: { valids: string[] }) {
          if (!valids.includes(value)) {
            return helpers.error("any.only", { valids });
          }
          return value;
        },
      },
      website: {
        validate(value: string, helpers: joi.CustomHelpers) {
          if (!protocol.test(value)) {
            return helpers.error("string.websiteIncomplete");
          }

          try {
            return new URL(value).href;
          }
          catch {
            return helpers.error("string.website");
          }
        },
      },
      locale: {
        validate(value: string, helpers: joi.CustomHelpers) {
          if (!locale.test(value)) {
            return helpers.error("string.locale");
          }
          return value;
        },
      },
      filePath: {
        method(criteria: Partial<ParsedPath>) {
          return this.$_addRule({ name: "filePath", args: criteria});
        },
        validate(value: string, helpers: joi.CustomHelpers, criteria: Partial<ParsedPath>) {
          if (!path.isAbsolute(value)) {
            return helpers.error("string.filePathRelative", criteria);
          }

          let { ext } = path.parse(value);
          if (criteria.ext && (ext !== criteria.ext)) {
            return helpers.error("string.filePathExtension", criteria);
          }

          return value;
        },
      },
    }
  },
  {
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
            if (!locale.test(lang)) {
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
  },
) as JoiExtended;
