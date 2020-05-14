import { DimensionsPOJO, MonetaryValuePOJO, WeightPOJO } from "../../common";
import { NonDeliveryAction } from "../../enums";
import { UUID } from "../../types";
import { NewLabelPOJO } from "./new-label";
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
   * Indicates how a non-deliverable package should be handled. If `undefined`, the carrier's
   * default behavior applies, which may incur charges.
   */
  nonDeliveryAction?: NonDeliveryAction;

  /**
   * Indicates whether the package contains alcohol
   */
  containsAlcohol?: boolean;

  /**
   * Indicates whether the
   */
  isNonMachinable?: boolean;

  /**
   * Label preferences for this package
   */
  label: NewLabelPOJO;

  /**
   * Describes the items inside the package
   */
  contents?: PackageItemPOJO[];
}
