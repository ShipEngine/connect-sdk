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
   * Indicates whether this is a test. When `true`, the request must not result in any
   * financial charges to any party.
   */
  isTestLabel?: boolean;

  /**
   * The shipment information needed to create a label
   */
  shipment: NewShipmentConfig;
}
