import { Label as ILabel, Label as LabelPOJO } from "../../../definitions";
import { hideAndFreeze, Joi, _internal } from "../../common";
import { Document, DocumentBase } from "./document";

export class Label extends DocumentBase implements ILabel {
  public static [_internal] = {
    label: "label",
    schema: Document[_internal].schema.keys({
      referenceFields: Joi.array().items(
        Joi.string().trim().singleLine().allow("").max(100)
      ),
    }),
  };

  public referenceFields: Array<string>;

  public constructor(pojo: LabelPOJO) {
    super(pojo);

    this.referenceFields = pojo.referenceFields || [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}
