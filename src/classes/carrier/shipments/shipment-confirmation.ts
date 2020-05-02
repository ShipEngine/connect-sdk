import { ShipmentConfirmationPOJO } from "../../../pojos/carrier";
import { Joi } from "../../../validation";
import { CustomData } from "../../common";
import { hideAndFreeze, _internal } from "../../utils";
import { PackageConfirmation } from "../packages/package-confirmation";
import { ShipmentIdentifier, shipmentIdentifierMixin } from "./shipment-identifier";

/**
 * Confirmation that a shipment has been created
 */
export class ShipmentConfirmation extends shipmentIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      estimatedDeliveryDateTime: Joi.date(),
      packages: Joi.array().min(1).items(PackageConfirmation[_internal].schema).required(),
      customData: CustomData[_internal].schema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The estimated date and time the shipment will be delivered
   */
  public readonly estimatedDeliveryDateTime?: Date;

  /**
   * Confirmation details about each package in the shipment
   */
  public readonly packages: ReadonlyArray<PackageConfirmation>;

  /**
   * Arbitrary data that will be persisted by the ShipEngine Integration Platform.
   */
  public readonly customData?: CustomData;

  //#endregion

  public constructor(pojo: ShipmentConfirmationPOJO) {
    super(pojo);

    this.estimatedDeliveryDateTime = pojo.estimatedDeliveryDateTime;
    this.packages = pojo.packages.map((parcel) => new PackageConfirmation(parcel));
    this.customData = pojo.customData && new CustomData(pojo.customData);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ShipmentConfirmation);
