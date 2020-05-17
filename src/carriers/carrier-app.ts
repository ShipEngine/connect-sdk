import { AppPOJO } from "../common";
import { App, hideAndFreeze, localize, validate, _internal } from "../internal";
import { Carrier } from "./carrier";
import { CarrierPOJO } from "./carrier-pojo";

/**
 * A ShipEngine Integration Platform carrier app
 */
export interface CarrierAppPOJO extends AppPOJO {
  carrier: CarrierPOJO;
}


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

  /**
   * Creates a copy of the app, localized for the specified locale if possible.
   */
  public localize(locale: string): CarrierApp {
    let pojo = localize(this, locale);
    return new CarrierApp(pojo);
  }

  /**
   * Returns the app as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
  public toJSON(locale?: string): CarrierAppPOJO {
    return {
      ...super.toJSON(),
      carrier: this.carrier.toJSON(locale),
    };
  }
}


// Prevent modifications to the class
hideAndFreeze(CarrierApp);
