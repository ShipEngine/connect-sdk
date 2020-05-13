import { DocumentFormat, DocumentSize } from "../enums";
import { hideAndFreeze, Joi, _internal } from "../internal";

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


/**
 * A document that is associated with a shipment or package, such as a customs form.
 */
export class Document {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "document",
    schema: Joi.object({
      name: Joi.string().trim().singleLine().min(1).max(100),
      size: Joi.string().enum(DocumentSize).required(),
      format: Joi.string().enum(DocumentFormat).required(),
      data: Joi.object().instance(Buffer).required(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The user-friendly name of the document (e.g. "Label", "Customs Form")
   */
  public readonly name: string;

  /**
   * The dimensions of the document
   */
  public readonly size: DocumentSize;

  /**
   * The file format of the document
   */
  public readonly format: DocumentFormat;

  /**
   * The document data, in the specified file format
   */
  public readonly data: Buffer;

  //#endregion

  public constructor(pojo: DocumentPOJO & { name: string }) {
    this.name = pojo.name;
    this.size = pojo.size;
    this.format = pojo.format;
    this.data = pojo.data;

    if (this.data.length === 0) {
      throw new Error(`${this.name} data cannot be empty`);
    }

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Document);
