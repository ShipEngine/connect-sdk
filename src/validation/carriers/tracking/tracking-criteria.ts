import { TrackingCriteria as ITrackingCriteria, TrackingCriteria as TrackingCriteriaPOJO } from "../../../definitions";
import { hideAndFreeze, Joi, _internal } from "../../common";
import { ShipmentIdentifier, ShipmentIdentifierBase } from "../shipments/shipment-identifier";

export class TrackingCriteria extends ShipmentIdentifierBase implements ITrackingCriteria {
  public static [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      returns: Joi.object({
        isReturn: Joi.boolean(),
      }),
      metadata: Joi.object(),
    }),
  };

  public returns: {
    isReturn: boolean;
  };

  public metadata: object;

  public constructor(pojo: TrackingCriteriaPOJO) {
    super(pojo);

    this.metadata = pojo.metadata || {};

    // If there's no return info, then the shipment is not a return
    let returns = pojo.returns || {};
    this.returns = {
      isReturn: returns.isReturn || false,
    };

    // Make this object immutable
    hideAndFreeze(this);
  }
}
