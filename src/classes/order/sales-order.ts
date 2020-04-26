// tslint:disable: max-classes-per-file
import { SalesOrderIdentifierPOJO } from "../../pojos/order";
import { Joi } from "../../validation";
import { Identifier } from "../common";

/**
 * Identifies a sales order
 */
export class SalesOrderIdentifier {
  //#region Class Fields

  public static readonly label = "sales order";

  /** @internal */
  public static readonly schema = Joi.object({
    salesOrderID: Joi.string().trim().singleLine().min(1).max(100).required(),
    identifiers: Joi.array().items(Identifier.schema),
  });

  //#endregion
  //#region Instance Fields

  /**
   * The vendor's unique ID for the order
   */
  public readonly salesOrderID: string;

  /**
   * Alternative identifiers associated with this sales order
   */
  public readonly identifiers: ReadonlyArray<Identifier>;

  //#endregion

  public constructor(pojo: SalesOrderIdentifierPOJO) {
    this.salesOrderID = pojo.salesOrderID;
    this.identifiers = pojo.identifiers ? pojo.identifiers.map((id) => new Identifier(id)) : [];

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.identifiers);
  }
}
