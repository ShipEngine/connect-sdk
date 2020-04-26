import { ShipEngineConstructor } from "../../internal-types";
import { UUID } from "../../types";
import { Joi, validate } from "../../validation";

interface POJO { id: UUID; }
interface ClassInstance { id: UUID; }

const uuidSchema = Joi.string().uuid();
const pojoSchema = Joi.object({ id: Joi.string().uuid() }).unknown(true);

/**
 * Maps ShipEngine Integration Platform classes by their UUIDs and the POJO object instances.
 * @internal
 */
export class ReferenceMap {
  private readonly _byID = new Map<UUID, ClassInstance>();
  private readonly _byPOJO = new Map<POJO, ClassInstance>();

  /**
   * Adds the given object to the map
   */
  public add(obj: ClassInstance, pojo: POJO): UUID {
    validate(pojo, obj.constructor as ShipEngineConstructor, pojoSchema);

    if (this._byPOJO.has(pojo) || this._byID.has(pojo.id)) {
      throw new ReferenceError(`Duplicate UUID: ${pojo.id}`);
    }

    this._byID.set(pojo.id, obj);
    this._byPOJO.set(pojo, obj);
    return pojo.id;
  }

  /**
   * Determines whether a class instance has been created for the given POJO object instance
   */
  public has(pojo: POJO, type: ShipEngineConstructor): boolean {
    return Boolean(this.get(pojo, type));
  }

  /**
   * Returns the class instance that corresponds to the specified POJO object instance, if any
   */
  public get<T extends ClassInstance>(pojo: POJO, type: ShipEngineConstructor): T | undefined;

  /**
   * Returns the class instance with the specified ID, if any
   */
  public get<T extends ClassInstance>(id: UUID | undefined, type: ShipEngineConstructor): T | undefined;

  public get<T extends ClassInstance>(key: POJO | UUID | undefined, type: ShipEngineConstructor)
  : T | undefined {
    let obj: T | undefined;

    if (typeof key === "string") {
      validate(key, `${type.label} ID`, uuidSchema);
      obj = this._byID.get(key) as T | undefined;
    }
    else if (key) {
      obj = this._byPOJO.get(key) as T | undefined;
    }

    if (obj && !(obj instanceof type)) {
      // We found a matching class instance, but it's of the wrong type,
      // which means there are two different types that have the same UUID
      throw new ReferenceError(`Duplicate UUID: ${(key as POJO).id || key}`);
    }

    return obj;
  }

  /**
   * Returns the class instance that corresponds to the specified UUID, or throws an error if not found
   */
  public lookup<T extends ClassInstance>(id: UUID, type: ShipEngineConstructor): T {
    validate(id, `${type.label} ID`, uuidSchema);
    let value = this.get<T>(id, type);

    if (!value) {
      throw new ReferenceError(`Unable to find ${type.label} ID: ${id}`);
    }

    return value;
  }

  /**
   * Clears the internal map of POJO objects to free-up memory after app is loaded
   */
  public finishedLoading() {
    // @ts-ignore
    delete this._byPOJO;
  }
}
