import type { Dimensions, DimensionsPOJO, MonetaryValue, MonetaryValuePOJO, Weight, WeightPOJO } from "../../common";
import { Customs, CustomsPOJO } from "../customs/customs";
import type { DeliveryConfirmation, DeliveryConfirmationIdentifierPOJO } from "../delivery-confirmation";
import type { NewLabel, NewLabelPOJO } from "../documents/new-label";
import type { Packaging, PackagingIdentifierPOJO } from "../packaging";
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
   * Customs declarations for this package. Usually only needed for international shipments.
   */
  customs?: CustomsPOJO;

  /**
   * Describes the items inside the package
   */
  contents?: ReadonlyArray<PackageItemPOJO>;
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
   * Customs declarations for this package
   */
  readonly customs: Customs;

  /**
   * Describes the items inside the package
   */
  readonly contents: ReadonlyArray<PackageItem>;
}
