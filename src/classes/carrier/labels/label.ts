import { LabelPOJO } from "../../../pojos/carrier";
import { Joi } from "../../../validation";

/**
 * A shipping label
 */
export class Label {
  //#region Class Fields

  public static readonly label = "label";

  /** @internal */
  public static readonly schema = Joi.object({
    trackingNumber: Joi.string().trim().singleLine().min(1).max(100).required(),
    image: Joi.object().instance(Buffer).required().keys({
      length: Joi.number().integer().min(1),
    }),
    forms: Joi.array().items(Joi.object({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      data: Joi.object().instance(Buffer).required().keys({
        length: Joi.number().integer().min(1),
      }),
    }))
  });

  //#endregion
  //#region Instance Fields

  /**
   * The carrier tracking number for this label
   */
  public readonly trackingNumber: string;

  /**
   * The label image, in the requested file format (i.e. PDF, PNG, ZPL).
   */
  public readonly image: Buffer;

  /**
   * Any additional forms that relate to the label, such as customs forms.
   */
  public readonly forms?: Array<{
    name: string;
    data: Buffer;
  }>;

  //#endregion

  public constructor(pojo: LabelPOJO) {
    this.trackingNumber = pojo.trackingNumber;
    this.image = pojo.image;
    this.forms = pojo.forms ? pojo.forms.map((form) => Object.freeze(form)) : [];

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.forms);
  }
}
