import { DocumentFormat, DocumentSize } from "../../../enums";
import { LabelSpecPOJO } from "../../../pojos/carrier";
import { Joi, validate } from "../../../validation";
import { App } from "../../common/app";
import { hideAndFreeze, _internal } from "../../utils";
import { NewShipment } from "../shipments/new-shipment";
import { Shipment } from "../shipments/shipment";

/**
 * Specifies the information needed to create a shipping label for a shipment.
 */
export class LabelSpec {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "label specification",
    schema: Joi.object({
      format: Joi.string().enum(DocumentFormat).required(),
      size: Joi.string().enum(DocumentSize).required(),
      shipment: Shipment[_internal].schema.required(),
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
