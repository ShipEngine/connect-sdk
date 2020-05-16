import { Note, NotePOJO } from "../../common";
import { createNotes, hideAndFreeze, Joi, _internal } from "../../internal";
import { ShipmentIdentifier, ShipmentIdentifierPOJO } from "../shipments/shipment-identifier";

/**
 * A shipment that could not be manifested, along with details about why
 */
export interface NonManifestedShipmentPOJO extends ShipmentIdentifierPOJO {
  /**
   * The carrier's error code
   */
  code?: string;

  /**
   * The carrier's description of the error code.
   * This description should not be specific to this particular shipment.
   */
  description?: string;

  /**
   * Human-readable information regarding the error, such as details that are specific
   * to this particular shipment
   */
  notes?: string | Array<string | NotePOJO>;
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
      code: Joi.string().trim().singleLine().min(1).max(100),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      notes: Note[_internal].notesSchema,
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The carrier's error code
   */
  public readonly code: string;

  /**
   * The carrier's description of the error code.
   * This description should not be specific to this particular shipment
   */
  public readonly description: string;

  /**
   * Human-readable information regarding the error, such as details that are specific
   * to this particular shipment
   */
  public readonly notes: ReadonlyArray<Note>;

  //#endregion

  public constructor(pojo: NonManifestedShipmentPOJO) {
    this.code = pojo.code || "";
    this.description = pojo.description || "";
    this.notes = createNotes(pojo.notes);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(NonManifestedShipment);
