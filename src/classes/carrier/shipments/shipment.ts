import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { ShipmentPOJO } from "../../../pojos/carrier";
import { CustomData } from "../../common";
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
      deliveryDateTime: Joi.date(),
      packages: Joi.array().min(1).items(Package[_internal].schema).required(),
      customData: CustomData[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The estimated date and time the shipment will be delivered
   */
  public readonly deliveryDateTime?: Date;

  /**
   * The list of packages in the shipment
   */
  public readonly packages: ReadonlyArray<Package>;

  /**
   * Arbitrary data that was returned for the shipment when the label was created.
   */
  public readonly customData: CustomData;

  //#endregion

  public constructor(pojo: ShipmentPOJO, app: App) {
    super(pojo, app);

    this.deliveryDateTime = pojo.deliveryDateTime;
    this.packages = pojo.packages.map((parcel) => new Package(parcel, app));
    this.customData = new CustomData(pojo.customData);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Shipment);
