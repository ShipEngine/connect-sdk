import { hideAndFreeze, Joi, _internal } from "../../internal";
import { ShipmentIdentifier, ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";

/**
 * A shipment that could not be manifested, along with details about why
 */
export interface NonManifestedShipmentPOJO extends ShipmentIdentifierPOJO {
  /**
   * The carrier's error code
   */
  errorCode?: string;

  /**
   * The carrier's description of the error code.
   * This description should not be specific to this particular shipment
   */
  errorDescription?: string;

  /**
   * Human-readable information regarding the error, such as details that are specific
   * to this particular shipment
   */
  notes?: string;
}


/**
 * A shipment that could not be manifested, along with details about why
 */
export class NonManifestedShipment {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "manifest confirmation",
    schema: ShipmentIdentifier[_internal].schema.keys({
      errorCode: Joi.string().trim().singleLine().min(1).max(100),
      errorDescription: Joi.string().trim().singleLine().allow("").max(1000),
      notes: Joi.string().allow("").max(5000),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The carrier's error code
   */
  public readonly errorCode: string;

  /**
   * The carrier's description of the error code.
   * This description should not be specific to this particular shipment
   */
  public readonly errorDescription: string;

  /**
   * Human-readable information regarding the error, such as details that are specific
   * to this particular shipment
   */
  public readonly notes: string;

  //#endregion

  public constructor(pojo: NonManifestedShipmentPOJO) {
    this.errorCode = pojo.errorCode || "";
    this.errorDescription = pojo.errorDescription || "";
    this.notes = pojo.notes || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(NonManifestedShipment);
