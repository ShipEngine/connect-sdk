import { ShipmentIdentifier as IShipmentIdentifier, ShipmentIdentifier as ShipmentIdentifierPOJO } from "../../../definitions";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../../common";

export abstract class ShipmentIdentifierBase implements IShipmentIdentifier {
  public trackingNumber: string;
  public identifiers: Identifiers;

  public constructor(pojo: ShipmentIdentifierPOJO) {
    this.trackingNumber = pojo.trackingNumber || "";
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}

export class ShipmentIdentifier extends ShipmentIdentifierBase {
  public static [_internal] = {
    label: "shipment",
    schema: Joi.object({
      trackingNumber: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public constructor(pojo: ShipmentIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
