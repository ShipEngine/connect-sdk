import { assert } from "../../assert";
import { LabelSpecConfig } from "../../config";
import { LabelFormat, LabelSize } from "../../enums";
import { NewShipment } from "../../shipment";
import { ShippingProviderApp } from "../app";

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
   * Indicates whether this is a test. When `true`, the request must not result in any
   * financial charges to any party.
   */
  public readonly isTestLabel: boolean;

  /**
   * The shipment information needed to create a label
   */
  public readonly shipment: NewShipment;

  /**
   * Creates a PickupRequest from a config object
   */
  public constructor(app: ShippingProviderApp, config: LabelSpecConfig) {
    assert.type.object(config, "pickup request");
    this.format = assert.string.enum(config.format, LabelFormat, "label format");
    this.size = assert.string.enum(config.size, LabelSize, "label size");
    this.isTestLabel = assert.type.boolean(config.isTestLabel, "isTestLabel flag", false);
    this.shipment = new NewShipment(app, config.shipment);

    // Prevent modifications after validation
    Object.freeze(this);
  }
}
