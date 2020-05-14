import { DocumentFormat, DocumentSize } from "../../enums";
import { hideAndFreeze, Joi, _internal } from "../../internal";

/**
 * The information needed to create a new label
 */
export interface NewLabelPOJO {
  /**
   * The dimensions of the document
   */
  size: DocumentSize;

  /**
   * The file format of the document
   */
  format: DocumentFormat;

  /**
   * Some carriers provide general-purpose fields on their labels for custom text.
   * This is sometimes used for messages, like "Thank you for shopping with us!",
   * or may be used to store reference data, such as account numbers, warehouse codes, etc.
   *
   * The exact location on the label depends on the carrier, as does the maximum length
   * of each field.
   *
   * NOTE: These fields should NOT be used to set **named** fields on the label,
   *       such as "RMA Number" or "Order ID". Those should be set using the correspond
   *       properties of the shipment.
   */
  referenceFields?: string[];
}


/**
 * The information needed to create a new label
 */
export class NewLabel {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "label",
    schema: Joi.object({
      format: Joi.string().enum(DocumentFormat).required(),
      size: Joi.string().enum(DocumentSize).required(),
      referenceFields: Joi.array().items(
        Joi.string().trim().singleLine().allow("").max(100)
      ),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The preferred file format of the label.
   * The carrier should return the label in this format, if possible.
   */
  public readonly format: DocumentFormat;

  /**
   * The preferred label size.
   * The carrier should return the label in this size, if possible.
   */
  public readonly size: DocumentSize;

  /**
   * Some carriers provide general-purpose fields on their labels for custom text.
   * This is sometimes used for messages, like "Thank you for shopping with us!",
   * or may be used to store reference data, such as account numbers, warehouse codes, etc.
   *
   * The exact location on the label depends on the carrier, as does the maximum length
   * of each field.
   *
   * NOTE: These fields should NOT be used to set **named** fields on the label,
   *       such as "RMA Number" or "Order ID". Those should be set using the correspond
   *       properties of the shipment.
   */
  public readonly referenceFields: ReadonlyArray<string>;

  //#endregion

  public constructor(pojo: NewLabelPOJO) {
    this.format = pojo.format;
    this.size = pojo.size;
    this.referenceFields = pojo.referenceFields || [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(NewLabel);
