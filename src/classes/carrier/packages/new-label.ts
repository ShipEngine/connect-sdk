import { DocumentFormat, DocumentSize } from "../../../enums";
import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { NewLabelPOJO } from "../../../pojos/carrier";

/**
 * The information needed to create a new label
 */
export class NewLabel {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "label",
    schema: Joi.object({
      format: Joi.string().enum(DocumentFormat).required(),
      size: Joi.string().enum(DocumentSize).required(),
      messages: Joi.array().items(
        Joi.string().trim().singleLine().allow("").max(100)
      ),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The preferred file format of the label.
   * The carrier should return the label in this format, if possible.
   */
  public readonly format: DocumentFormat;

  /**
   * The preferred label size.
   * The carrier should return the label in this size, if possible.
   */
  public readonly size: DocumentSize;

  /**
   * Customized strings the end user expects to appear on their label.
   * The exact location on the label depends on the carrier. Some carriers
   * may limit the number of allowed label messages, or not support them at all.
   */
  public readonly messages: ReadonlyArray<string>;

  //#endregion

  public constructor(pojo: NewLabelPOJO) {
    this.format = pojo.format;
    this.size = pojo.size;
    this.messages = pojo.messages || [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(NewLabel);
