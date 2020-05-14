import { DocumentFormat, DocumentSize, DocumentType } from "../../enums";

/**
 * A document that is associated with a shipment or package, such as a customs form.
 */
export interface DocumentPOJO {
  /**
   * The user-friendly name of the document (e.g. "Label", "Customs Form")
   */
  name?: string;

  /**
   * The type of document (e.g. label, customs form, SCAN form)
   */
  type: DocumentType;

  /**
   * The dimensions of the document
   */
  size: DocumentSize;

  /**
   * The file format of the document
   */
  format: DocumentFormat;

  /**
   * The document data, in the specified file format
   */
  data: Buffer;
}

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
