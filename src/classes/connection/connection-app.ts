import { hideAndFreeze, validate, _internal } from "../../internal";
import { ConnectionAppPOJO } from "../../pojos/connection";
import { App } from "../common/app";
import { Connection } from "./connection";

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
}

// Prevent modifications to the class
hideAndFreeze(ConnectionApp);
