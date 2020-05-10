import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { ShipmentPOJO } from "../../../pojos/carrier";
import { DateTimeZone } from "../../common";
import { App } from "../../common/app";
import { Package } from "../packages/package";
import { NewShipment, newShipmentMixin } from "./new-shipment";
import { ShipmentIdentifier, shipmentIdentifierMixin } from "./shipment-identifier";

/**
 * A complete shipment that already exists and has identifiers
 */
export interface Shipment extends ShipmentIdentifier, NewShipment {}

/**
 * A complete shipment that already exists and has identifiers
 */
export class Shipment extends newShipmentMixin(shipmentIdentifierMixin()) {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.concat(NewShipment[_internal].schema).keys({
      deliveryDateTime: DateTimeZone[_internal].schema,
      packages: Joi.array().min(1).items(Package[_internal].schema).required(),
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The estimated date and time the shipment will be delivered
   */
  public readonly deliveryDateTime?: DateTimeZone;

  /**
   * The list of packages in the shipment
   */
  public readonly packages: ReadonlyArray<Package>;

  /**
   * Arbitrary data that was returned for the shipment when the label was created.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: ShipmentPOJO, app: App) {
    super(pojo, app);

    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.packages = pojo.packages.map((parcel) => new Package(parcel, app));
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Shipment);
