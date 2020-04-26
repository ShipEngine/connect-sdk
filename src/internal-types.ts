import { ValidationSchema } from "./validation";

/**
 * Defines the static class properties of ShipEngine Integration Platform SDK classes.
 * @internal
 */
export interface ShipEngineClass {
  label: string;
  schema: ValidationSchema;
}

/**
 * A constructor function for a ShipEngine Integration Platform SDK class.
 * @internal
 */
export interface ShipEngineConstructor extends Function, ShipEngineClass {}

/**
 * A constructor function. This can be any constructor, but is usually used to refer to a
 * ShipEngine Integration Platform SDK class.
 * @internal
 */
export interface Constructor<T extends object = object> extends Partial<ShipEngineClass> {
  name: string;
  new(...args: unknown[]): T;
}
