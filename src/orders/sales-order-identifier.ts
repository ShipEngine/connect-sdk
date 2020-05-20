// tslint:disable: max-classes-per-file
import { Identifiers, IdentifiersPOJO } from "../common";
import { hideAndFreeze, Joi, _internal } from "../common/internal";


/**
 * Identifies a sales order
 */
export interface SalesOrderIdentifierPOJO {
  /**
   * The marketplace's unique ID for the sales order
   */
  id: string;

  /**
   * Your own identifiers for this sales order
   */
  identifiers?: IdentifiersPOJO;
}


/**
 * Abstract base class for sales order identity
 */
export abstract class SalesOrderIdentifierBase {
  //#region Public Fields

  /**
   * The marketplace's unique ID for the sales order
   */
  public readonly id: string;

  /**
   * Your own identifiers for this sales order
   */
  public readonly identifiers: Identifiers;

  //#endregion

  public constructor(pojo: SalesOrderIdentifierPOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
  }
}


/**
 * Identifies a sales order
 */
export class SalesOrderIdentifier extends SalesOrderIdentifierBase {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "sales order",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
    }),
  };

  //#endregion

  public constructor(pojo: SalesOrderIdentifierPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(SalesOrderIdentifier);
