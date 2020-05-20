import { hideAndFreeze, Joi, _internal } from "../../common/internal";
import { Document, DocumentBase } from "./document";
import { DocumentPOJO } from "./document-pojo";

/**
 * A shipping label
 */
export interface LabelPOJO extends DocumentPOJO {
  /**
   * The **actual** reference fields on the label, which may not match the originally-specified
   * reference fields due to the carrier's restrictions on the number of fields or the length
   * of each field.
   */
  referenceFields?: string[];
}


/**
 * A shipping label
 */
export class Label extends DocumentBase {
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
