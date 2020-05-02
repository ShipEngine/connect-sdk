import { DocumentFormat, DocumentSize } from "../../enums";
import { NewShipmentPOJO } from "./shipment-pojo";

/**
 * Specifies the information needed to create a shipping label for a shipment.
 */
export interface LabelSpecPOJO {
  /**
   * The preferred file format of the label.
   * The carrier should return the label in this format, if possible.
   */
  format: DocumentFormat;

  /**
   * The preferred label size.
   * The carrier should return the label in this size, if possible.
   */
  size: DocumentSize;

  /**
   * The shipment information needed to create a label
   */
  shipment: NewShipmentPOJO;
}
