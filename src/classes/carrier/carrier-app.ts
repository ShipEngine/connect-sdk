import { CarrierAppPOJO } from "../../pojos/carrier";
import { validate } from "../../validation";
import { App } from "../common/app";
import { hideAndFreeze, _internal } from "../utils";
import { Carrier } from "./carrier";

/**
 * A ShipEngine Integration Platform carrier app
 */
export class CarrierApp extends App {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "ShipEngine Integration Platform carrier app",
    schema: App[_internal].schema.keys({
      carrier: Carrier[_internal].schema.required(),
    }),
  };

  //#endregion
  //#region Public Fields

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

    // The app is now finished loading, so no new references can be added
    this[_internal].references.finishedLoading();

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(CarrierApp);
