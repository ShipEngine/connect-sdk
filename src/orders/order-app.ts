import { AppPOJO } from "../common";
import { App, hideAndFreeze, localize, validate, _internal } from "../common/internal";
import { Marketplace } from "./marketplace";
import { MarketplacePOJO } from "./marketplace-pojo";

/**
 * A ShipEngine Integration Platform order app
 */
export interface OrderAppPOJO extends AppPOJO {
  marketplace: MarketplacePOJO;
}


/**
 * A ShipEngine Integration Platform order app
 */
export class OrderApp extends App {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "ShipEngine Integration Platform order app",
    schema: App[_internal].schema.keys({
      marketplace: Marketplace[_internal].schema.required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * Indicates that this is an order app
   */
  public readonly type = "order";

  /**
   * The app's marketplace object
   */
  public readonly marketplace: Marketplace;

  //#endregion

  public constructor(pojo: OrderAppPOJO) {
    super(pojo);

    validate(pojo, OrderApp);

    this.marketplace = new Marketplace(pojo.marketplace, this);

    // The app is now finished loading, so free-up memory that's no longer needed
    this[_internal].references.finishedLoading();

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Creates a copy of the app, localized for the specified locale if possible.
   */
  public localize(locale: string): OrderApp {
    let pojo = localize(this, locale);
    return new OrderApp(pojo);
  }

  /**
   * Returns the app as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
  public toJSON(locale?: string): OrderAppPOJO {
    return {
      ...super.toJSON(),
      marketplace: this.marketplace.toJSON(locale),
    };
  }
}

// Prevent modifications to the class
hideAndFreeze(OrderApp);
