import type { Document, DocumentPOJO } from "./document";

/**
 * A shipping label
 */
export interface LabelPOJO extends DocumentPOJO {
  /**
   * The **actual** reference fields on the label, which may not match the originally-specified
   * reference fields due to the carrier's restrictions on the number of fields or the length
   * of each field.
   */
  referenceFields?: string[];
}


/**
 * A shipping label
 */
export interface Label extends Document {
  /**
   * The **actual** reference fields on the label, which may not match the originally-specified
   * reference fields due to the carrier's restrictions on the number of fields or the length
   * of each field.
   */
  readonly referenceFields: ReadonlyArray<string>;
}
