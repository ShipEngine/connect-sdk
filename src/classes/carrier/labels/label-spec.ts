import { LabelFormat, LabelSize } from "../../../enums";
import { LabelSpecPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { App } from "../../common/app";
import { hideAndFreeze, _internal } from "../../utils";
import { NewShipment, Shipment } from "../shipment";

/**
 * Specifies the information needed to create a shipping label for a shipment.
 */
export class LabelSpec {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "label specification",
    schema: Joi.object({
      format: Joi.string().enum(LabelFormat).required(),
      size: Joi.string().enum(LabelSize).required(),
      shipment: Shipment[_internal].schema.required(),
    }),
  };

  //#endregion
  //#region Public Fields

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

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(LabelSpec);
