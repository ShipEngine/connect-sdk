import { ErrorCode, UUID } from "../../public";
import { error } from "./errors";
import { ShipEngineConstructor } from "./types";
import { _internal } from "./utils";

interface ClassInstance { id: UUID; code?: string; type?: string }

interface Reference {
  type: ShipEngineConstructor;
  instance: ClassInstance;
}

const _private = Symbol("private fields");

/**
 * Maps ShipEngine Connect classes by their UUIDs
 */
export class ReferenceMap {
  private readonly [_private] = {
    map: new Map<UUID, Reference>(),
    isFinishedLoading: false,
  };

  /**
   * Adds the given object to the map
   */
  public add(instance: ClassInstance): void {
    const type = instance.constructor as ShipEngineConstructor;

    const { map, isFinishedLoading } = this[_private];
    const existing = map.get(instance.id);

    if (existing) {
      // We already have a reference to this instance. Just make sure the types match.
      if (existing.type !== type) {
        // There are two different objects with the same UUID
        throw error(ErrorCode.Invalid, `Duplicate UUID: ${instance.id}`);
      }
    }
    else {
      if (isFinishedLoading) {
        // The app has already finished loading, so no new objects can be added.
        throw error(ErrorCode.Invalid, `Cannot add new ${type[_internal].label} after the app has loaded`);
      }

      // Certain definitions need to be referenced by their code identifier rather than their GUID ID.
      if (instance.code) {
        // Add this new reference
        map.set(instance.code, { type, instance });
      }
      // Delivery Confirmations need to be able to be referenced by their "type" property
      if (instance.type) {
        map.set(instance.type, { type, instance });
      }
      // Add this new reference
      map.set(instance.id, { type, instance });
    }
  }

  /**
   * Returns the class instance implements Iinstance with the specified ID, if any
   */
  public get<T extends ClassInstance>(
    instance: ClassInstance | string | undefined, type: ShipEngineConstructor<T>): T | undefined {

    // This is for optional references
    if (!instance) return undefined;

    const { map } = this[_private];
    let reference;
    if (typeof instance === "string") {
      reference = map.get(instance);
      if (reference && reference.type !== type) {
        throw error(ErrorCode.Invalid,
          `${instance} is a ${reference.type[_internal].label} not a ${type[_internal].label}`);
      }
    }
    else {
      reference = map.get(instance.id);
      if (reference && reference.type !== type) {
        throw error(ErrorCode.Invalid,
          `${instance.id} is a ${reference.type[_internal].label} ID not a ${type[_internal].label} ID`);
      }
    }


    return reference && reference.instance as T;
  }

  /**
   * Returns the class instance that corresponds to the specified UUID, or throws an error if not found
   */
  public lookup<T extends ClassInstance>(
    instance: ClassInstance | string, type: ShipEngineConstructor<T>): T;
  public lookup<T extends ClassInstance>(
    instance: ClassInstance | string | undefined, type: ShipEngineConstructor<T>): T | undefined;
  public lookup<T extends ClassInstance>(
    instance: ClassInstance | string | undefined, type: ShipEngineConstructor<T>): T | undefined {

    // This is for optional references
    if (!instance) return undefined;

    const value = this.get<T>(instance, type);

    if (!value) {
      if (typeof instance === "string") {
        throw error(ErrorCode.Invalid, `Unable to find ${type[_internal].label}: ${instance}`);
      }
      else {
        throw error(ErrorCode.Invalid, `Unable to find ${type[_internal].label} ID: ${instance.id}`);
      }
    }

    return value;
  }

  /**
   * Once the app has loaded, no new references can be added
   */
  public finishedLoading(): void {
    this[_private].isFinishedLoading = true;
  }
}
