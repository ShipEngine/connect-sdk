import { assert } from "../assert";
import { UUID } from "../types";

interface Definition { id: UUID; }
interface Class { id: UUID; }
type Constructor = Function;  // tslint:disable-line: ban-types

/**
 * Maps ShipEngine IPaaS classes by their UUIDs and definitions.
 */
export class ReferenceMap {
  private readonly _byID = new Map<UUID, Class>();
  private readonly _byDefinition = new Map<Definition, Class>();

  /**
   * Adds the given object to the map
   */
  public add(obj: Class, definition: Definition, type: string): UUID {
    assert.type.object(definition, type);
    assert.string.uuid(definition.id, `${type} ID`);

    if (this._byDefinition.has(definition) || this._byID.has(definition.id)) {
      throw new ReferenceError(`Duplicate UUID: ${definition.id}`);
    }

    this._byID.set(definition.id, obj);
    this._byDefinition.set(definition, obj);
    return definition.id;
  }

  /**
   * Determines whether a class instance has been created for the given definition object
   */
  public has(definition: Definition, ctor: Constructor): boolean {
    return Boolean(this.get(definition, ctor));
  }

  /**
   * Returns the class instance that corresponds to the specified definition object, if any
   */
  public get<T extends Class>(definition: Definition, ctor: Constructor): T | undefined;

  /**
   * Returns the class instance with the specified ID, if any
   */
  public get<T extends Class>(id: UUID | undefined, ctor: Constructor, type: string): T | undefined;

  public get<T extends Class>(definition: Definition | UUID | undefined, ctor: Constructor, type?: string)
  : T | undefined {
    let obj: T | undefined;

    if (typeof definition === "string") {
      assert.string.uuid(definition, `${type} ID`);
      obj = this._byID.get(definition) as T | undefined;
    }
    else if (definition) {
      obj = this._byDefinition.get(definition) as T | undefined;
    }

    if (obj && !(obj instanceof ctor)) {
      // We found a matching class instance, but it's of the wrong type,
      // which means there are two different types that have the same UUID
      throw new ReferenceError(`Duplicate UUID: ${(definition as Definition).id || definition}`);
    }

    return obj;
  }

  /**
   * Returns the class instance that corresponds to the specified UUID, or throws an error if not found
   */
  public lookup<T extends Class>(id: UUID, ctor: Constructor, type: string): T {
    assert.string.uuid(id, `${type} ID`);
    let value = this.get<T>(id, ctor, type);

    if (!value) {
      throw new ReferenceError(`Unable to find ${type}: ${id}`);
    }

    return value;
  }

  /**
   * Clears the internal map of definition objects to free-up memory after app is loaded
   */
  public finishedLoading() {
    // @ts-ignore
    delete this._byDefinition;
  }
}
