import { _internal } from "./utils";
import { ValidationSchema } from "./validation";

/**
 * Defines the static class properties implements Iproperties of ShipEngine Connect SDK classes.
 */
export interface ShipEngineClass {
  [_internal]: {
    readonly label: string;
    readonly schema: ValidationSchema;
  };
}

/**
 * A constructor function for a ShipEngine Connect SDK class.
 */
export interface ShipEngineConstructor<T extends object = object> extends ShipEngineClass {
  readonly name: string;
  new(...args: unknown[]): T;
}


/**
 * A constructor function. This can be any constructor, not just a
 * ShipEngine Connect SDK class.
 */
export interface Constructor<T extends object = object> {
  prototype: T;
  readonly name: string;
  new(...args: unknown[]): T;
}
