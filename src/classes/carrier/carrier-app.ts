import { CarrierPOJO } from "../../pojos/carrier";
import { AppPOJO } from "../../pojos/common";
import { App } from "../common/app";
import { Carrier } from "./carrier";

/**
 * A ShipEngine Integration Platform carrier app
 */
export class CarrierApp extends App {
  //#region Class Fields

  public static readonly label = "ShipEngine Integration Platform carrier app";

  /** @internal */
  public static readonly schema = App.schema;

  //#endregion
  //#region Instance Fields

  /**
   * Indicates that this is a carrier app
   */
  public readonly type = "carrier";

  /**
   * The app's carrier object
   */
  public readonly carrier: Carrier;

  //#endregion

  public constructor(pojo: AppPOJO, carrier: CarrierPOJO) {
    super(pojo);

    this.carrier = new Carrier(carrier, this);

    // The app is now finished loading, so free-up memory that's no longer needed
    this._references.finishedLoading();

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
