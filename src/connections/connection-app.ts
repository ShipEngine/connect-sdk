import { AppPOJO } from "../common";
import { App, hideAndFreeze, localize, validate, _internal } from "../internal";
import { Connection } from "./connection";
import { ConnectionPOJO } from "./connection-pojo";

/**
 * A ShipEngine Integration Platform connection app
 */
export interface ConnectionAppPOJO extends AppPOJO {
  connection: ConnectionPOJO;
}


/**
 * A ShipEngine Integration Platform connection app
 */
export class ConnectionApp extends App {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "ShipEngine Integration Platform connection app",
    schema: App[_internal].schema.keys({
      connection: Connection[_internal].schema.required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * Indicates that this is a connection app
   */
  public readonly type = "connection";

  /**
   * The app's connection object
   */
  public readonly connection: Connection;

  //#endregion

  public constructor(pojo: ConnectionAppPOJO) {
    super(pojo);

    validate(pojo, ConnectionApp);

    this.connection = new Connection(pojo.connection, this);

    // The app is now finished loading, so free-up memory that's no longer needed
    this[_internal].references.finishedLoading();

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Creates a copy of the app, localized for the specified locale if possible.
   */
  public localize(locale: string): ConnectionApp {
    let pojo = localize(this, locale);
    return new ConnectionApp(pojo);
  }

  /**
   * Returns the app as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
  public toJSON(locale?: string): ConnectionAppPOJO {
    return {
      ...super.toJSON(),
      connection: this.connection.toJSON(locale),
    };
  }
}

// Prevent modifications to the class
hideAndFreeze(ConnectionApp);
