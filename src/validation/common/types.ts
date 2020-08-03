import { _internal } from "./utils";
import { ValidationSchema } from "./validation";

/**
 * Defines the static class properties implements Iproperties of ShipEngine Integration Platform SDK classes.
 */
export interface ShipEngineClass {
  [_internal]: {
    label: string;
    schema: ValidationSchema;
  };
}

/**
 * A constructor function for a ShipEngine Integration Platform SDK class.
 */
export interface ShipEngineConstructor<T extends object = object> extends ShipEngineClass {
  name: string;
  new(...args: unknown[]): T;
}


/**
 * A constructor function. This can be any constructor, not just a
 * ShipEngine Integration Platform SDK class.
 */
export interface Constructor<T extends object = object> {
  prototype: T;
  name: string;
  new(...args: unknown[]): T;
}
