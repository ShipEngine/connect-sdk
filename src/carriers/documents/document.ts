// tslint:disable: max-classes-per-file
import { ErrorCode } from "../../common";
import { error, hideAndFreeze, Joi, _internal } from "../../common/internal";
import { DocumentPOJO } from "./document-pojo";
import { DocumentFormat, DocumentSize, DocumentType } from "./enums";

/**
 * Abstract base class for documents and labels
 */
export abstract class DocumentBase {
  //#region Public Fields

  /**
   * The user-friendly name of the document (e.g. "Label", "Customs Form")
   */
  public readonly name: string;

  /**
   * The type of document (e.g. label, customs form, SCAN form)
   */
  public readonly type: DocumentType;

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

  public constructor(pojo: DocumentPOJO) {
    this.name = getDocumentName(pojo);
    this.type = pojo.type;
    this.size = pojo.size;
    this.format = pojo.format;
    this.data = pojo.data;

    if (this.data.length === 0) {
      throw error(ErrorCode.Validation, `${this.name} data cannot be empty`);
    }
  }
}


/**
 * A document that is associated with a shipment or package, such as a customs form.
 */
export class Document extends DocumentBase {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "document",
    schema: Joi.object({
      name: Joi.string().trim().singleLine().allow("").max(100),
      type: Joi.string().enum(DocumentType).required(),
      size: Joi.string().enum(DocumentSize).required(),
      format: Joi.string().enum(DocumentFormat).required(),
      data: Joi.object().instance(Buffer).required(),
    }),
  };

  //#endregion

  public constructor(pojo: DocumentPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Document);


/**
 * Returns the default document name if the document doesn't already have a name
 */
function getDocumentName(document: DocumentPOJO): string {
  if (document.name) return document.name;

  switch (document.type) {
    case DocumentType.Label:
      return "Label";

    case DocumentType.CustomsForm:
      return "Customs Form";

    case DocumentType.ScanForm:
      return "SCAN Form";

    default:
      return "Document";
  }
}
