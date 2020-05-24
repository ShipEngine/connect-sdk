import type { Dimensions, DimensionsPOJO, MonetaryValue, MonetaryValuePOJO, Weight, WeightPOJO } from "../../common";
import type { DeliveryConfirmation, DeliveryConfirmationIdentifierPOJO } from "../delivery-confirmation";
import type { NewLabel, NewLabelPOJO } from "../documents/new-label";
import type { NonDeliveryOption } from "../enums";
import type { Packaging, PackagingIdentifierPOJO } from "../packaging";
import type { CustomsItem, CustomsItemPOJO } from "./customs-item";
import type { PackageItem, PackageItemPOJO } from "./package-item";

/**
 * The package information needed when creating a new shipment
 */
export interface NewPackagePOJO {
  /**
   * The packaging used for this package
   */
  packaging: PackagingIdentifierPOJO;

  /**
   * The requested delivery confirmation
   */
  deliveryConfirmation?: DeliveryConfirmationIdentifierPOJO;

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
  contents?: ReadonlyArray<PackageItemPOJO>;

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
    contents?: ReadonlyArray<CustomsItemPOJO>;
  };
}


/**
 * The package information needed when creating a new shipment
 */
export interface NewPackage {
  /**
   * The packaging used
   */
  readonly packaging: Packaging;

  /**
   * The requested delivery confirmation
   */
  readonly deliveryConfirmation?: DeliveryConfirmation;

  /**
   * The package dimensions
   */
  readonly dimensions?: Dimensions;

  /**
   * The package weight
   */
  readonly weight?: Weight;

  /**
   * The insured value of this package
   */
  readonly insuredValue: MonetaryValue;

  /**
   * Indicates whether the package contains alcohol
   */
  readonly containsAlcohol: boolean;

  /**
   * Indicates whether the package cannot be processed automatically due to size, shape, weight, etc.
   * and requires manual handling.
   */
  readonly isNonMachinable: boolean;

  /**
   * Label preferences for this package
   */
  readonly label: NewLabel;

  /**
   * Describes the items inside the package
   */
  readonly contents: ReadonlyArray<PackageItem>;

  /**
   * Customs declarations for this package
   */
  readonly customs: {
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
    contents: ReadonlyArray<CustomsItem>;
  };
}
