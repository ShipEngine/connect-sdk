import { SalesOrderIdentifier as ISalesOrderIdentifier, SalesOrderIdentifierPOJO } from "../../definitions";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../common";


export abstract class SalesOrderIdentifierBase implements ISalesOrderIdentifier {
  public readonly id: string;
  public readonly identifiers: Identifiers;

  public constructor(pojo: SalesOrderIdentifierPOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}


export class SalesOrderIdentifier extends SalesOrderIdentifierBase {
  public static readonly [_internal] = {
    label: "sales order",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  public constructor(pojo: SalesOrderIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
