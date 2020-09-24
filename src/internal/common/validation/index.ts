import * as joi from "joi";
import { ErrorCode } from "../../../public";
import { error } from "../errors";
import { ShipEngineConstructor } from "../types";
import { _internal } from "../utils";
import { objectValidation, ObjectValidationSchema } from "./object-validation";
import { stringValidation, StringValidationSchema } from "./string-validation";

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


export function validateArray<T>(value: T[], type: ShipEngineConstructor, schema?: ValidationSchema): T[];
export function validateArray<T>(value: T[], type: string, schema: ValidationSchema): T[];

/**
 * Validates an array of values against a Joi schema. If validation fails, an error is thrown.
 */
export function validateArray<T>(value: T[], arg2: ShipEngineConstructor | string, arg3?: ValidationSchema): T[] {
  const label = typeof arg2 === "string" ? arg2 : arg2[_internal].label;
  const itemSchema = arg3 || (arg2 as ShipEngineConstructor)[_internal].schema;
  validateAgainstSchema(value, label, Joi.array().items(itemSchema));
  return value;
}


export function validate<T>(value: T, type: ShipEngineConstructor, schema?: ValidationSchema): T;
export function validate<T>(value: T, type: string, schema: ValidationSchema): T;

/**
 * Validates a value against a Joi schema. If validation fails, an error is thrown.
 */
export function validate<T>(value: T, arg2: ShipEngineConstructor | string, arg3?: ValidationSchema): T {
  const label = typeof arg2 === "string" ? arg2 : arg2[_internal].label;
  const schema = arg3 || (arg2 as ShipEngineConstructor)[_internal].schema;
  validateAgainstSchema(value, label, schema);
  return value;
}


/**
 * Validates a value against a Joi schema. If validation fails, an error is thrown.
 */
function validateAgainstSchema(value: unknown, label: string, schema: ValidationSchema): void {
  if (value === undefined || value === null) {
    throw error(ErrorCode.Invalid, `Invalid ${label}: A value is required`);
  }

  const result = schema.validate(value, joiOptions as joi.ValidationOptions);

  if (result.error) {
    throw error(
      ErrorCode.Invalid,
      `Invalid ${label}: ` + result.error.details.map((detail) => detail.message).join(", "),
      {
        details: result.error.details
      }
    );
  }
}


/**
 * A Joi validation schema, with our custom extensions
 */
export type ValidationSchema = joi.Schema | StringValidationSchema;


/**
 * The Joi validation library, with our custom extensions
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
 * The Joi validation schema, with our custom extensions
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Joi = joi.extend(stringValidation, objectValidation) as JoiExtended;
