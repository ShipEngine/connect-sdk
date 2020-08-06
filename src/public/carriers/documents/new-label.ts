import type { DocumentFormat, DocumentSize } from "../enums";

/**
 * The information needed to create a new label
 */
export interface NewLabel {
  /**
   * The preferred file format of the label.
   * The carrier should return the label in this format, if possible.
   */
  readonly format: DocumentFormat;

  /**
   * The preferred label size.
   * The carrier should return the label in this size, if possible.
   */
  readonly size: DocumentSize;

  /**
   * Some carriers provide general-purpose fields on their labels for custom text.
   * This is sometimes used for messages, like "Thank you for shopping with us!",
   * or may be used to store reference data, such as account numbers, warehouse codes, etc.
   *
   * The exact location on the label depends on the carrier, as does the allowed number of fields
   * and the maximum length of each field. If more fields are specified than are supported by the
   * carrier, then the extra fields should be ignored. Likewise, if a field length exceeds the
   * carrier's maximum length, then it should be truncated. The *actual* values that are used
   * should be returned, so the caller can detect any differences.
   *
   * NOTE: These fields should NOT be used to set **named** fields on the label,
   *       such as "RMA Number" or "Order ID". Those should be set using the correspond
   *       properties of the shipment.
   */
  readonly referenceFields: readonly string[];
}
