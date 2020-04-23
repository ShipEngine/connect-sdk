import { assert } from "../../../assert";
import { LabelFormat, LabelSize } from "../../../enums";
import { LabelSpecPOJO } from "../../../pojos";
import { App } from "../../app";
import { NewShipment } from "../../shipment";

/**
 * Specifies the information needed to create a shipping label for a shipment.
 */
export class LabelSpec {
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

  public constructor(app: App, pojo: LabelSpecPOJO) {
    assert.type.object(pojo, "pickup request");
    this.format = assert.string.enum(pojo.format, LabelFormat, "label format");
    this.size = assert.string.enum(pojo.size, LabelSize, "label size");
    this.shipment = new NewShipment(app, pojo.shipment);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
