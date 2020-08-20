import { ShipmentIdentifierPOJO, TrackingCriteria as ITrackingCriteria } from "../../../public";
import { hideAndFreeze, Joi, _internal } from "../../common";
import { ShipmentIdentifier, ShipmentIdentifierBase } from "../shipments/shipment-identifier";

export interface TrackingCriteriaPOJO extends ShipmentIdentifierPOJO {
  returns?: { isReturn?: boolean };
  metadata?: object;
}


export class TrackingCriteria extends ShipmentIdentifierBase implements ITrackingCriteria {
  public static readonly [_internal] = {
    label: "shipment",
    schema: ShipmentIdentifier[_internal].schema.keys({
      returns: Joi.object({
        isReturn: Joi.boolean(),
      }),
      metadata: Joi.object(),
    }),
  };

  public readonly returns: {
    readonly isReturn: boolean;
  };

  public readonly metadata: object;

  public constructor(pojo: TrackingCriteriaPOJO) {
    super(pojo);

    this.metadata = pojo.metadata || {};

    // If there's no return info, then the shipment is not a return
    const returns = pojo.returns || {};
    this.returns = {
      isReturn: returns.isReturn || false,
    };

    // Make this object immutable
    hideAndFreeze(this);
  }
}
