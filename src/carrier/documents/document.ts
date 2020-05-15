import { DocumentFormat, DocumentSize, DocumentType } from "../../enums";
import { error, ErrorCode } from "../../errors";
import { Constructor, hideAndFreeze, Joi, _internal } from "../../internal";
import { DocumentPOJO, LabelPOJO } from "./document-pojo";

/**
 * A factory function that instantiates the correct document class based on the document type.
 */
export function createDocument(pojo: DocumentPOJO): Document {
  if (pojo.type === DocumentType.Label) {
    return new Label(pojo);
  }
  else {
    return new Document(pojo);
  }
}

/**
 * A document that is associated with a shipment or package, such as a customs form.
 */
export class Document extends documentMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "document",
    schema: Joi.object({
      name: Joi.string().trim().singleLine().min(1).max(100),
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
 * A shipping label
 */
// tslint:disable-next-line: max-classes-per-file
export class Label extends documentMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "label",
    schema: Document[_internal].schema.keys({
      referenceFields: Joi.array().items(
        Joi.string().trim().singleLine().allow("").max(100)
      ),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The **actual** reference fields on the label, which may not match the originally-specified
   * reference fields due to the carrier's restrictions on the number of fields or the length
   * of each field.
   */
  public readonly referenceFields: ReadonlyArray<string>;

  //#endregion

  public constructor(pojo: LabelPOJO) {
    super(pojo);

    this.referenceFields = pojo.referenceFields || [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(Label);


/**
 * Extends a base class with document fields
 * @internal
 */
export function documentMixin(base: Constructor = Object) {
  return class DocumentMixin extends base {
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
      base === Object ? super() : super(pojo);

      this.name = getDocumentName(pojo);
      this.type = pojo.type;
      this.size = pojo.size;
      this.format = pojo.format;
      this.data = pojo.data;

      if (this.data.length === 0) {
        throw error(ErrorCode.InvalidInput, `${this.name} data cannot be empty`);
      }
    }
  };
}


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
