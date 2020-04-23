/**
 * A constructor function
 */
export type Constructor<T extends object = object> = new(...args: unknown[]) => T;
