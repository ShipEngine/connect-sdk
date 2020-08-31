import { AcknowledgedSalesOrder as AcknowledgedSalesOrderPOJO } from "../../public";
import { hideAndFreeze, Joi, _internal } from "../common";
import { SalesOrderIdentifierBase, SalesOrderIdentifier } from "./sales-order-identifier";

export class AcknowledgedSalesOrder extends SalesOrderIdentifierBase{

  public static readonly [_internal] = {
    label: "acknowledged sales order",
    schema: SalesOrderIdentifier[_internal].schema.keys({
      succeeded: Joi.boolean().required(),
      failureReason: Joi.string()
    })
  };
  
  public readonly succeeded: boolean;
  public readonly failureReason: string;

  public constructor(pojo: AcknowledgedSalesOrderPOJO) {
    super(pojo);

    this.succeeded = pojo.succeeded;
    this.failureReason = pojo.failureReason || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}
