import { CarrierAppPOJO } from "../../pojos/carrier";
import { validate } from "../../validation";
import { App } from "../common/app";
import { Carrier } from "./carrier";

/**
 * A ShipEngine Integration Platform carrier app
 */
export class CarrierApp extends App {
  //#region Class Fields

  public static readonly label = "ShipEngine Integration Platform carrier app";

  /** @internal */
  public static readonly schema = App.schema.keys({
    carrier: Carrier.schema.required(),
  });

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

  public constructor(pojo: CarrierAppPOJO) {
    super(pojo);

    validate(pojo, CarrierApp);

    this.carrier = new Carrier(pojo.carrier, this);

    // The app is now finished loading, so free-up memory that's no longer needed
    this._references.finishedLoading();

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
