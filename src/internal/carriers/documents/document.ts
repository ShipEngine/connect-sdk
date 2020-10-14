import { Document as DocumentPOJO, DocumentFormat, DocumentSize, DocumentType, ErrorCode } from "../../../public";
import { error, hideAndFreeze, Joi, _internal } from "../../common";

export abstract class DocumentBase {
  public readonly name: string;
  public readonly type: DocumentType;
  public readonly size: DocumentSize;
  public readonly format: DocumentFormat;
  public readonly data: Buffer;

  public constructor(pojo: DocumentPOJO) {
    this.name = getDocumentName(pojo);
    this.type = pojo.type;
    this.size = pojo.size;
    this.format = pojo.format;
    this.data = pojo.data;

    if (this.data.length === 0) {
      throw error(ErrorCode.Invalid, `${this.name} data cannot be empty`);
    }
  }
}

export class Document extends DocumentBase {
  public static readonly [_internal] = {
    label: "document",
    schema: Joi.object({
      name: Joi.string().trim().singleLine().allow(""),
      type: Joi.string().enum(DocumentType).required(),
      size: Joi.string().enum(DocumentSize).required(),
      format: Joi.string().enum(DocumentFormat).required(),
      data: Joi.object().instance(Buffer).required(),
    }),
  };

  public constructor(pojo: DocumentPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
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
