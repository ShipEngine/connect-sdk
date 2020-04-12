import { assert } from "./assert";
import { UUID } from "./types";

interface Config { id: UUID; }
interface Class { id: UUID; }

/**
 * Maps ShipEngine IPaaS classes by their UUIDs and Config object instances.
 */
export class ReferenceMap {
  private readonly _byID = new Map<UUID, Class>();
  private readonly _byConfig = new Map<Config, Class>();

  /**
   * Adds the given object to the map
   */
  public add(obj: Class, config: Config, type: string): UUID {
    assert.type.object(config, type);
    assert.string.uuid(config.id, `${type} ID`);

    if (this._byConfig.has(config) || this._byID.has(config.id)) {
      throw new ReferenceError(`Duplicate UUID: ${config.id}`);
    }

    this._byID.set(config.id, obj);
    this._byConfig.set(config, obj);
    return config.id;
  }

  /**
   * Determines whether a class instance has been created for the given Config object
   */
  public has(config: Config): boolean {
    return Boolean(this.get(config));
  }

  /**
   * Returns the class instance that corresponds to the specified Config object, if any
   */
  public get<T extends Class>(config: Config): T | undefined;

  /**
   * Returns the class instance with the specified ID, if any
   */
  public get<T extends Class>(id: UUID | undefined, type: string): T | undefined;

  public get<T extends Class>(config: Config | UUID | undefined, type?: string): T | undefined {
    if (typeof config === "string") {
      assert.string.uuid(config, `${type} ID`);
      return this._byID.get(config) as T | undefined;
    }
    else if (config) {
      return this._byConfig.get(config) as T | undefined;
    }
  }

  /**
   * Returns the class instance that corresponds to the specified UUID, or throws an error if not found
   */
  public lookup<T extends Class>(id: UUID, type: string): T {
    assert.string.uuid(id, `${type} ID`);
    let value = this.get<T>({ id });

    if (!value) {
      throw new ReferenceError(`Unable to find ${type}: ${id}`);
    }

    return value;
  }

  /**
   * Clears the internal map of Config objects to free-up memory after app configuration is complete.
   */
  public clearConfigs() {
    // @ts-ignore
    delete this._byConfig;
  }
}
