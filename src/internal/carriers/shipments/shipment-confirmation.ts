import { FulfillmentService, ShipmentConfirmation as IShipmentConfirmation, ShipmentConfirmationPOJO } from "../../../public";
import { calculateTotalCharges, Charge, DateTimeZone, hideAndFreeze, Joi, MonetaryValue, TimeRange, _internal } from "../../common";
import { PackageConfirmation } from "../packages/package-confirmation";
import { ShipmentIdentifier, ShipmentIdentifierBase } from "./shipment-identifier";

export class ShipmentConfirmation extends ShipmentIdentifierBase implements IShipmentConfirmation {
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      deliveryDateTime: DateTimeZone[_internal].schema,
      charges: Joi.array().min(1).items(Charge[_internal].schema).required(),
      packages: Joi.array().min(1).items(PackageConfirmation[_internal].schema).required(),
    }),
  };

  public readonly deliveryDateTime?: DateTimeZone;
  public readonly charges: ReadonlyArray<Charge>;
  public readonly totalAmount: MonetaryValue;
  public readonly packages: ReadonlyArray<PackageConfirmation>;

  public get isTrackable(): boolean {
    return Boolean(this.trackingNumber);
  }

  public get package(): PackageConfirmation {
    return this.packages[0];
  }

  public constructor(pojo: ShipmentConfirmationPOJO) {
    super(pojo);

    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.charges = pojo.charges.map((charge) => new Charge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.packages = pojo.packages.map((parcel) => new PackageConfirmation(parcel));

    // Make this object immutable
    hideAndFreeze(this);
  }
}
