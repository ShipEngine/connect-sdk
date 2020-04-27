import { ConnectionAppPOJO } from "../../pojos/connection";
import { validate } from "../../validation";
import { App } from "../common/app";
import { Connection } from "./connection";

/**
 * A ShipEngine Integration Platform connection app
 */
export class ConnectionApp extends App {
  //#region Class Fields

  public static readonly label = "ShipEngine Integration Platform connection app";

  /** @internal */
  public static readonly schema = App.schema.keys({
    connection: Connection.schema.required(),
  });

  //#endregion
  //#region Instance Fields

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
    this._references.finishedLoading();

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
