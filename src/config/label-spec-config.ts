import { LabelFormat, LabelSize } from "../enums";
import { NewShipmentConfig } from "./shipment-config";

/**
 * Specifies the information needed to create a shipping label for a shipment.
 */
export interface LabelSpecConfig {
  /**
   * The expected file format of the label
   */
  format: LabelFormat;

  /**
   * The expected label size
   */
  size: LabelSize;

  /**
   * The shipment information needed to create a label
   */
  shipment: NewShipmentConfig;
}
