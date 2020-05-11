import { DocumentFormat, DocumentSize } from "../../enums";
import { UUID } from "../../types";
import { DimensionsPOJO, MonetaryValuePOJO, WeightPOJO } from "../common";
import { PackageItemPOJO } from "./package-item-pojo";

/**
 * The package information needed when creating a new shipment
 */
export interface NewPackagePOJO {
  /**
   * The ID of the packaging used
   */
  packagingID: UUID;

  /**
   * The package dimensions
   */
  dimensions?: DimensionsPOJO;

  /**
   * The package weight
   */
  weight?: WeightPOJO;

  /**
   * The insured value of this package
   */
  insuredValue?: MonetaryValuePOJO;

  /**
   * Indicates whether the package contains alcohol
   */
  containsAlcohol?: boolean;

  /**
   * Indicates whether the
   */
  isNonMachineable?: boolean;

  /**
   * Label preferences for this package
   */
  label: NewLabelPOJO;

  /**
   * Describes the items inside the package
   */
  contents?: PackageItemPOJO[];
}

/**
 * The information needed to create a new label
 */
export interface NewLabelPOJO {
  /**
   * The dimensions of the document
   */
  size: DocumentSize;

  /**
   * The file format of the document
   */
  format: DocumentFormat;

  /**
   * Customized strings the end user expects to appear on their label.
   * The exact location on the label depends on the carrier. Some carriers
   * may limit the number of allowed label messages, or not support them at all.
   */
  messages?: string[];
}
