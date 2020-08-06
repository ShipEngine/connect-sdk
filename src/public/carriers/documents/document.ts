import type { DocumentFormat, DocumentSize, DocumentType } from "../enums";

/**
 * A document that is associated with a shipment or package, such as a customs form.
 */
export interface Document {
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
