import { ShipEngineConstructor } from "../../internal-types";
import { UUID } from "../../types";
import { Joi, validate } from "../../validation";
import { _internal } from "../utils";

interface ClassInstance { id: UUID; }

interface Reference {
  type: ShipEngineConstructor;
  instance: ClassInstance;
}

const uuidSchema = Joi.string().uuid();
const _private = Symbol("private fields");

/**
 * Maps ShipEngine Integration Platform classes by their UUIDs
 * @internal
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
    let type = instance.constructor as ShipEngineConstructor;
    validate(instance.id, `${type[_internal].label} ID`, uuidSchema);

    let { map, isFinishedLoading } = this[_private];
    let existing = map.get(instance.id);

    if (existing) {
      // We already have a reference to this instance. Just make sure the types match.
      if (existing.type !== type) {
        // There are two different objects with the same UUID
        throw new ReferenceError(`Duplicate UUID: ${instance.id}`);
      }
    }
    else {
      if (isFinishedLoading) {
        // The app has already finished loading, so no new objects can be added.
        throw new ReferenceError(`Cannot add new ${type[_internal].label} after the app has loaded`);
      }

      // Add this new reference
      map.set(instance.id, { type, instance });
    }
  }

  /**
   * Returns the class instance with the specified ID, if any
   */
  public get<T extends ClassInstance>(id: UUID | undefined, type: ShipEngineConstructor): T | undefined {
    // This is for optional ID fields
    if (!id) return undefined;

    validate(id, `${type[_internal].label} ID`, uuidSchema);

    let { map } = this[_private];
    let reference = map.get(id);
    return reference && reference.instance as T;
  }

  /**
   * Returns the class instance that corresponds to the specified UUID, or throws an error if not found
   */
  public lookup<T extends ClassInstance>(id: UUID, type: ShipEngineConstructor): T {
    let value = this.get<T>(id, type);

    if (!value) {
      throw new ReferenceError(`Unable to find ${type[_internal].label} ID: ${id}`);
    }

    return value;
  }

  /**
   * Once the app has loaded, no new references can be added
   */
  public finishedLoading() {
    this[_private].isFinishedLoading = true;
  }
}
