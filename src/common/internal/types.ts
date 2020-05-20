import { _internal } from "./utils";
import { ValidationSchema } from "./validation";

/**
 * Defines the static class properties of ShipEngine Integration Platform SDK classes.
 * @internal
 */
export interface ShipEngineClass {
  [_internal]: {
    readonly label: string;
    readonly schema: ValidationSchema;
  };
}

/**
 * A constructor function for a ShipEngine Integration Platform SDK class.
 * @internal
 */
export interface ShipEngineConstructor<T extends object = object> extends ShipEngineClass {
  readonly name: string;
  new(...args: unknown[]): T;
}

/**
 * A constructor function. This can be any constructor, but is usually used to refer to a
 * ShipEngine Integration Platform SDK class.
 * @internal
 */
export interface Constructor<T extends object = object> {
  prototype: T;
  readonly name: string;
  new(...args: unknown[]): T;
}
