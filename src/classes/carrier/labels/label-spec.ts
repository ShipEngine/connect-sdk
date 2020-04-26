import { LabelFormat, LabelSize } from "../../../enums";
import { LabelSpecPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { App } from "../../common";
import { NewShipment, Shipment } from "../shipment";

/**
 * Specifies the information needed to create a shipping label for a shipment.
 */
export class LabelSpec {
  //#region Class Fields

  public static readonly label = "label specification";

  /** @internal */
  public static readonly schema = Joi.object({
    format: Joi.string().enum(LabelFormat).required(),
    size: Joi.string().enum(LabelSize).required(),
    shipment: Shipment.schema.required(),
  });

  //#endregion
  //#region Instance Fields

  /**
   * The expected file format of the label
   */
  public readonly format: LabelFormat;

  /**
   * The expected label size
   */
  public readonly size: LabelSize;

  /**
   * The shipment information needed to create a label
   */
  public readonly shipment: NewShipment;

  //#endregion

  public constructor(pojo: LabelSpecPOJO, app: App) {
    validate(pojo, LabelSpec);

    this.format = pojo.format;
    this.size = pojo.size;
    this.shipment = new NewShipment(pojo.shipment, app);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
