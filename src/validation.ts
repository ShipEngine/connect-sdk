import * as joi from "@hapi/joi";
import { ErrorCode, ipaasError } from "./errors";
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

/**
 * Validates a value against a Joi schema. If validation fails, an error is thrown.
 * @internal
 */
export function validate(value: unknown, type: ShipEngineConstructor, schema?: ValidationSchema): void;
export function validate(value: unknown, type: string, schema: ValidationSchema): void;

export function validate(value: unknown, arg2: ShipEngineConstructor | string, arg3?: ValidationSchema): void {
  let label = typeof arg2 === "string" ? arg2 : arg2.label || arg2.name;
  let schema = arg3 || (arg2 as ShipEngineConstructor).schema;

  if (value === undefined || value === null) {
    throw ipaasError(ErrorCode.Validation, `Invalid ${label}: \n  A value is required`);
  }

  let { error } = schema.validate(value, joiOptions as joi.ValidationOptions);

  if (error) {
    throw ipaasError(
      ErrorCode.Validation,
      `Invalid ${label}: \n  ` + error.details.map((detail) => detail.message).join(" \n  "),
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
      "string.semver": "{{#label}} must be a version number, like 1.23.456",
      "string.money": "{{#label}} must be a monetary value, like ##.##",
      "string.website": "{{#label}} must be a valid website URL",
      "string.websiteIncomplete": '{{#label}} must be a complete website URL, including "http://" or "https://"',
    },
    rules: {
      singleLine: {
        validate(value: string, { error }: joi.CustomHelpers) {
          const multiline =  /\n|\r|\t/;
          if (multiline.test(value)) {
            return error("string.singleLine");
          }
          return value;
        },
      },
      isoDateTime: {
        validate(value: string, { error }: joi.CustomHelpers) {
          const semver = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/;
          if (!semver.test(value) || isNaN(new Date(value).getTime())) {
            return error("string.isoDateTime");
          }
          return value;
        },
      },
      semver: {
        validate(value: string, { error }: joi.CustomHelpers) {
          const semver = /^\d+\.\d+\.\d+/;
          if (!semver.test(value)) {
            return error("string.semver");
          }
          return value;
        },
      },
      money: {
        validate(value: string, { error }: joi.CustomHelpers) {
          const money = /^\d+(\.\d+)?$/;
          if (!money.test(value)) {
            return error("string.money");
          }
          return value;
        },
      },
      enum: {
        method(enumeration: Record<string, string>) {
          let valids = Object.values(enumeration);
          return this.$_addRule({ name: "enum", args: { valids }});
        },
        validate(value: string, { error }: joi.CustomHelpers, { valids }: { valids: string[] }) {
          if (!valids.includes(value)) {
            return error("any.only", { valids });
          }
          return value;
        },
      },
      website: {
        validate(value: string, { error }: joi.CustomHelpers) {
          const protocol = /^https?:\/\//;
          if (!protocol.test(value)) {
            return error("string.websiteIncomplete");
          }

          try {
            return new URL(value).href;
          }
          catch {
            return error("string.website");
          }
        },
      },
    }
  }
) as JoiExtended;
