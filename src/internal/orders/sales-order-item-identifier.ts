import { SalesOrderItemIdentifier as ISalesOrderItemIdentifier, SalesOrderItemIdentifierPOJO } from "../../public";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../common";

export abstract class SalesOrderItemIdentifierBase implements ISalesOrderItemIdentifier {
  public readonly id: string;
  public readonly sku: string;
  public readonly identifiers: Identifiers;

  public constructor(pojo: SalesOrderItemIdentifierPOJO) {
    this.id = pojo.id;
    this.sku = pojo.sku || "";
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}


export class SalesOrderItemIdentifier extends SalesOrderItemIdentifierBase {
  public static readonly [_internal] = {
    label: "sales order item",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).required(),
      sku: Joi.string().singleLine().allow(""),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public constructor(pojo: SalesOrderItemIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
