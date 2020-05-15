import { DimensionsPOJO, MonetaryValuePOJO, WeightPOJO } from "../../common";
import { NonDeliveryOption } from "../../enums";
import { UUID } from "../../types";
import { NewLabelPOJO } from "../documents/new-label-pojo";
import { CustomsItemPOJO } from "./customs-item-pojo";
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
  isNonMachinable?: boolean;

  /**
   * Label preferences for this package
   */
  label: NewLabelPOJO;

  /**
   * Describes the items inside the package
   */
  contents?: PackageItemPOJO[];

  /**
   * Customs declarations for this package. Usually only needed for international shipments.
   */
  customs?: {
    /**
     * Indicates what should be done if the package cannot be delivered.
     * If `undefined`, the default behavior of the receiving country's customs department applies,
     * which may incur charges.
     */
    nonDeliveryOption?: NonDeliveryOption;

    /**
     * Describes the contents of the package for customs purposes.
     *
     * NOTE: Customs contents may not correspond one-to-one with the package contents.
     * Package contents usually include one item per unique merchandise SKU
     * (e.g. one red t-shirt and one blue t-shirt), whereas customs contentsare often grouped by
     * product type (e.g. two t-shirts). In addition, some package contents don't need to be dclared
     * for customs purposes.
     */
    contents?: CustomsItemPOJO[];
  };
}
