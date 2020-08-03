import { DocumentType, ShipmentConfirmation as IShipmentConfirmation, ShipmentConfirmation as ShipmentConfirmationPOJO } from "../../../definitions";
import { calculateTotalCharges, Charge, DateTimeZone, hideAndFreeze, Joi, MonetaryValue, _internal } from "../../common";
import { Document } from "../documents/document";
import { Label } from "../documents/label";
import { createDocument, isLabel } from "../documents/utils";
import { PackageConfirmation } from "../packages/package-confirmation";
import { ShipmentIdentifier, ShipmentIdentifierBase } from "./shipment-identifier";

export class ShipmentConfirmation extends ShipmentIdentifierBase implements IShipmentConfirmation {
  public static [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      documents: Joi.array().min(1).items(
        Joi.alternatives(
          Document[_internal].schema,
          Label[_internal].schema,
        )
      ).required(),
      deliveryDateTime: DateTimeZone[_internal].schema,
      charges: Joi.array().min(1).items(Charge[_internal].schema).required(),
      packages: Joi.array().min(1).items(PackageConfirmation[_internal].schema).required(),
    }),
  };

  public documents: Array<Document | Label>;
  public deliveryDateTime?: DateTimeZone;
  public charges: Array<Charge>;
  public totalAmount: MonetaryValue;
  public packages: Array<PackageConfirmation>;

  public get isTrackable(): boolean {
    return Boolean(this.trackingNumber);
  }

  public get package(): PackageConfirmation {
    return this.packages[0];
  }

  public get label(): Label | undefined {
    return this.documents.find(isLabel);
  }

  public get customsForm(): Document | undefined {
    return this.documents.find((doc) => doc.type === DocumentType.CustomsForm);
  }

  public constructor(pojo: ShipmentConfirmationPOJO) {
    super(pojo);

    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.charges = pojo.charges.map((charge) => new Charge(charge));
    this.totalAmount = calculateTotalCharges(this.charges);
    this.packages = pojo.packages.map((parcel) => new PackageConfirmation(parcel));
    this.documents = pojo.documents.map(createDocument);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
