import { SalesOrderIdentifier as ISalesOrderIdentifier, SalesOrderIdentifierPOJO } from "../../public";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../common";


export abstract class SalesOrderIdentifierBase implements ISalesOrderIdentifier {
  public readonly id: string;
  public readonly orderNumber: string;
  public readonly identifiers: Identifiers;

  public constructor(pojo: SalesOrderIdentifierPOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
    this.orderNumber = pojo.orderNumber || "";
  }
}


export class SalesOrderIdentifier extends SalesOrderIdentifierBase {
  public static readonly [_internal] = {
    label: "sales order",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).required(),
      orderNumber: Joi.string().optional().allow(""),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public constructor(pojo: SalesOrderIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
