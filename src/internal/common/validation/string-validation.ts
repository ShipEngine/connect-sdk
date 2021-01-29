import * as joi from "joi";
import * as path from "path";
import { ParsedPath } from "path";
import { regex } from "../utils";

/**
 * Extended Joi string validation schema
 */
export interface StringValidationSchema extends joi.StringSchema {
  /**
   * Requires a string value to be a single-line (no newlines, carriage returns, or tabs)
   */
  singleLine(): StringValidationSchema;

  /**
   * Requires a string value to specify a complete ISO 8601 date/time with a time zone
   * (e.g. 2005-09-23T17:30:00.000Z or 2005-09-23T17:30:00+05:30)
   */
  isoDateTime(args: { timeZone: boolean }): StringValidationSchema;

  /**
   * Requires a string value to be a UTC offset (e.g. "+05:30") or a valid IANA time zone
   * (e.g. "America/Los_Angeles", "Asia/Tokyo").
   *
   * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  timeZone(): StringValidationSchema;

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
  filePath(args: Partial<ParsedPath>): StringValidationSchema;
}


/**
 * Joi string validation extensions
 */
export const stringValidation: joi.Extension = {
  type: "string",
  base: joi.string(),
  messages: {
    "string.singleLine": "{{#label}} cannot contain newlines or tabs",
    "string.isoDateTime": "{{#label}} must be an ISO 8601 date and time, like 2005-09-23T17:30:00",
    "string.isoDateTimeZone": "{{#label}} must be a complete ISO 8601 date/time with a time zone, like 2005-09-23T17:30:00+05:30",
    "string.isoDateTimeNoZone": "{{#label}} should not include a time zone",
    "string.isoDateTimeInvalid": "{{#label}} must be a valid date/time",
    "string.timeZone": '{{#label}} must be a UTC offset, like "+05:30", or a valid IANA time zone, like "America/Los_Angeles"',
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
      validate(value: string, helpers: joi.CustomHelpers): string | joi.ErrorReport {
        const multiline = /\n|\r|\t/;
        if (multiline.test(value)) {
          return helpers.error("string.singleLine");
        }
        return value;
      },
    },
    isoDateTime: {
      method(args: { timeZone: boolean }): joi.Schema {
        return this.$_addRule({ name: "isoDateTime", args });
      },
      validate(value: string, helpers: joi.CustomHelpers, args: { timeZone: boolean }): string | joi.ErrorReport {
        const match = regex.isoDateTime.exec(value);
        const hasTimeZone = match && match[2];

        if (!match) {
          if (args.timeZone) {
            return helpers.error("string.isoDateTimeZone");
          }
          else {
            return helpers.error("string.isoDateTime");
          }
        }
        else if (args.timeZone && !hasTimeZone) {
          return helpers.error("string.isoDateTimeZone");
        }
        else if (!args.timeZone && hasTimeZone) {
          return helpers.error("string.isoDateTimeNoZone");
        }
        else if (isNaN(new Date(value).getTime())) {
          return helpers.error("string.isoDateTimeInvalid");
        }
        return value;
      },
    },
    timeZone: {
      validate(value: string, helpers: joi.CustomHelpers): string | joi.ErrorReport {
        if (!regex.utcOffset.test(value) && !isValidTimeZone(value)) {
          return helpers.error("string.timeZone");
        }
        return value;
      },
    },
    appName: {
      validate(value: string, helpers: joi.CustomHelpers): string | joi.ErrorReport {
        if (!regex.appName.test(value)) {
          return helpers.error("string.appName");
        }
        return value;
      },
    },
    semver: {
      validate(value: string, helpers: joi.CustomHelpers): string | joi.ErrorReport {
        if (!regex.semver.test(value)) {
          return helpers.error("string.semver");
        }
        return value;
      },
    },
    money: {
      validate(value: string, helpers: joi.CustomHelpers): string | joi.ErrorReport {
        if (!regex.money.test(value)) {
          return helpers.error("string.money");
        }
        return value;
      },
    },
    enum: {
      method(enumeration: Record<string, string>): joi.Schema {
        const valids = Object.values(enumeration);
        return this.$_addRule({ name: "enum", args: { valids } });
      },
      validate(value: string, helpers: joi.CustomHelpers, { valids }: { valids: string[] }): string | joi.ErrorReport {
        if (!valids.includes(value)) {
          return helpers.error("any.only", { valids });
        }
        return value;
      },
    },
    website: {
      validate(value: string, helpers: joi.CustomHelpers): string | joi.ErrorReport {
        if (!regex.protocol.test(value)) {
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
      validate(value: string, helpers: joi.CustomHelpers): string | joi.ErrorReport {
        if (!regex.locale.test(value)) {
          return helpers.error("string.locale");
        }
        return value;
      },
    },
    filePath: {
      method(args: Partial<ParsedPath>): joi.Schema {
        return this.$_addRule({ name: "filePath", args });
      },
      validate(value: string, helpers: joi.CustomHelpers, args: Partial<ParsedPath>): string | joi.ErrorReport {
        if (!path.isAbsolute(value)) {
          return helpers.error("string.filePathRelative", args);
        }

        const { ext } = path.parse(value);
        if (args.ext && (ext !== args.ext)) {
          return helpers.error("string.filePathExtension", args);
        }

        return value;
      },
    },
  }
};


const ianaTimeZones: Record<string, boolean> = {};

function isValidTimeZone(timeZone: string): boolean {
  // If we've already checked this time zone, then return the cached value
  const isKnown = ianaTimeZones[timeZone];
  if (isKnown !== undefined) {
    return isKnown;
  }

  // Determine whether this time zone is valid
  try {
    new Intl.DateTimeFormat("en", { timeZone });  // eslint-disable-line no-new
    return ianaTimeZones[timeZone] = true;
  }
  catch (_) {
    return ianaTimeZones[timeZone] = false;
  }
}
