import type { Dimensions, MonetaryValue, Weight } from "../../common";
import { Customs } from "../customs/customs";
import type { DeliveryConfirmation } from "../delivery-confirmation";
import type { NewLabel } from "../documents/new-label";
import type { Packaging } from "../packaging";
import type { PackageItem } from "./package-item";

/**
 * The package information needed when creating a new shipment
 */
export interface NewPackage {
  /**
   * The packaging used
   */
  packaging: Packaging;

  /**
   * The requested delivery confirmation
   */
  deliveryConfirmation?: DeliveryConfirmation;

  /**
   * The package dimensions
   */
  dimensions?: Dimensions;

  /**
   * The package weight
   */
  weight?: Weight;

  /**
   * The insured value of this package
   */
  insuredValue: MonetaryValue;

  /**
   * Indicates whether the package contains alcohol
   */
  containsAlcohol: boolean;

  /**
   * Indicates whether the package cannot be processed automatically due to size, shape, weight, etc.
   * and requires manual handling.
   */
  isNonMachinable: boolean;

  /**
   * Label preferences for this package
   */
  label: NewLabel;

  /**
   * Customs declarations for this package
   */
  customs: Customs;

  /**
   * Describes the items inside the package
   */
  contents: Array<PackageItem>;
}
