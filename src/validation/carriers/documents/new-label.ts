import { DocumentFormat, DocumentSize, NewLabel as INewLabel, NewLabel as NewLabelPOJO } from "../../../definitions";
import { hideAndFreeze, Joi, _internal } from "../../common";

export class NewLabel implements INewLabel {
  public static [_internal] = {
    label: "label",
    schema: Joi.object({
      format: Joi.string().enum(DocumentFormat).required(),
      size: Joi.string().enum(DocumentSize).required(),
      referenceFields: Joi.array().items(
        Joi.string().trim().singleLine().allow("").max(100)
      ),
    }),
  };

  public format: DocumentFormat;
  public size: DocumentSize;
  public referenceFields: Array<string>;

  public constructor(pojo: NewLabelPOJO) {
    this.format = pojo.format;
    this.size = pojo.size;
    this.referenceFields = pojo.referenceFields || [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}
