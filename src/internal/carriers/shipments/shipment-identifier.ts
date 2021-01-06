import { ShipmentIdentifier as IShipmentIdentifier, ShipmentIdentifierPOJO } from "../../../public";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../../common";

export abstract class ShipmentIdentifierBase implements IShipmentIdentifier {
  public readonly trackingNumber: string;
  public readonly identifiers: Identifiers;

  public constructor(pojo: ShipmentIdentifierPOJO) {
    this.trackingNumber = pojo.trackingNumber || "";
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}

export class ShipmentIdentifier extends ShipmentIdentifierBase {
  public static readonly [_internal] = {
    label: "shipment",
    schema: Joi.object({
      trackingNumber: Joi.string().singleLine().allow(""),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public constructor(pojo: ShipmentIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
