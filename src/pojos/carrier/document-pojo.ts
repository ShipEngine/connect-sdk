import { DocumentFormat, DocumentSize } from "../../enums";

/**
 * A document that is associated with a shipment or package, such as a customs form.
 */
export interface DocumentPOJO {
  /**
   * The user-friendly name of the document (e.g. "Label", "Customs Form")
   */
  name?: string;

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
