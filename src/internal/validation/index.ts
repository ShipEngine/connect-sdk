import * as joi from "@hapi/joi";
import { _internal } from "..";
import { error, ErrorCode } from "../../errors";
import { ShipEngineConstructor } from "../types";
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


/**
 * Validates an array of values against a Joi schema. If validation fails, an error is thrown.
 * @internal
 */
export function validateArray(value: unknown[], type: ShipEngineConstructor, schema?: ValidationSchema): void;
export function validateArray(value: unknown[], type: string, schema: ValidationSchema): void;
export function validateArray(value: unknown[], arg2: ShipEngineConstructor | string, arg3?: ValidationSchema): void {
  let label = typeof arg2 === "string" ? arg2 : arg2[_internal].label;
  let itemSchema = arg3 || (arg2 as ShipEngineConstructor)[_internal].schema;
  validateAgainstSchema(value, label, Joi.array().items(itemSchema));
}


/**
 * Validates a value against a Joi schema. If validation fails, an error is thrown.
 * @internal
 */
export function validate(value: unknown, type: ShipEngineConstructor, schema?: ValidationSchema): void;
export function validate(value: unknown, type: string, schema: ValidationSchema): void;
export function validate(value: unknown, arg2: ShipEngineConstructor | string, arg3?: ValidationSchema): void {
  let label = typeof arg2 === "string" ? arg2 : arg2[_internal].label;
  let schema = arg3 || (arg2 as ShipEngineConstructor)[_internal].schema;
  validateAgainstSchema(value, label, schema);
}


/**
 * Validates a value against a Joi schema. If validation fails, an error is thrown.
 * @internal
 */
function validateAgainstSchema(value: unknown, label: string, schema: ValidationSchema): void {
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
 * The Joi validation schema, with our custom extensions
 * @internal
 */
// tslint:disable-next-line: variable-name
export const Joi = joi.extend(stringValidation, objectValidation) as JoiExtended;
