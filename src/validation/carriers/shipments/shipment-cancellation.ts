import { ShipmentCancellation as IShipmentCancellation, ShipmentCancellation as ShipmentCancellationPOJO, UUID } from "../../../definitions";
import { hideAndFreeze, Joi, _internal } from "../../common";
import { ShipmentIdentifier, ShipmentIdentifierBase } from "./shipment-identifier";

export class ShipmentCancellation extends ShipmentIdentifierBase implements IShipmentCancellation {
  public static [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      cancellationID: Joi.string().uuid().required(),
      metadata: Joi.object(),
    }),
  };

  public cancellationID: UUID;
  public metadata: object;

  public constructor(pojo: ShipmentCancellationPOJO) {
    super(pojo);

    this.cancellationID = pojo.cancellationID;
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
