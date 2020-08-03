import { SalesOrderItemIdentifier as ISalesOrderItemIdentifier, SalesOrderItemIdentifier as SalesOrderItemIdentifierPOJO } from "../../definitions";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../common";

export abstract class SalesOrderItemIdentifierBase implements ISalesOrderItemIdentifier {
  public id: string;
  public sku: string;
  public identifiers: Identifiers;

  public constructor(pojo: SalesOrderItemIdentifierPOJO) {
    this.id = pojo.id;
    this.sku = pojo.sku || "";
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}


export class SalesOrderItemIdentifier extends SalesOrderItemIdentifierBase {
  public static [_internal] = {
    label: "sales order item",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      sku: Joi.string().trim().singleLine().allow("").max(100),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public constructor(pojo: SalesOrderItemIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
