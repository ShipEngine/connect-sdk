import { DocumentFormat, DocumentSize, NewLabel as INewLabel, NewLabelPOJO } from "../../../public";
import { hideAndFreeze, Joi, _internal } from "../../common";

export class NewLabel implements INewLabel {
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

  public readonly format: DocumentFormat;
  public readonly size: DocumentSize;
  public readonly referenceFields: ReadonlyArray<string>;

  public constructor(pojo: NewLabelPOJO) {
    this.format = pojo.format;
    this.size = pojo.size;
    this.referenceFields = pojo.referenceFields || [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}
