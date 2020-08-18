import { NonDeliveryOption } from "../enums";
import { CustomsItemPOJO, CustomsItem } from "./customs-item";

/**
 * Customs declarations for international shipments
 */
export interface CustomsPOJO {
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
}

export interface Customs {
  /**
   * Indicates what should be done if the package cannot be delivered.
   * If `undefined`, the default behavior of the receiving country's customs department applies,
   * which may incur charges.
   */
  readonly nonDeliveryOption?: NonDeliveryOption;

  /**
   * Describes the contents of the package for customs purposes.
   *
   * NOTE: Customs contents may not correspond one-to-one with the package contents.
   * Package contents usually include one item per unique merchandise SKU
   * (e.g. one red t-shirt and one blue t-shirt), whereas customs contentsare often grouped by
   * product type (e.g. two t-shirts). In addition, some package contents don't need to be dclared
   * for customs purposes.
   */
  readonly contents: readonly CustomsItem[];
}
