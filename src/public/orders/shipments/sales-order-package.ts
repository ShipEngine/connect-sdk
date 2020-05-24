import { Customs, CustomsPOJO, PackageIdentifier, PackageIdentifierPOJO } from "../../carriers";
import { Dimensions, DimensionsPOJO, MonetaryValue, MonetaryValuePOJO, URLString, Weight, WeightPOJO } from "../../common";
import { InsuranceProvider } from "../enums";
import { SalesOrderPackageItem, SalesOrderPackageItemPOJO } from "./sales-order-package-item";

/**
 * A package that contains items from one or more sales orders
 */
export interface SalesOrderPackagePOJO extends PackageIdentifierPOJO {
  /**
   * The URL of a webpage where the customer can track the package
   */
  trackingURL?: URLString | URL;

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
   * Indicates which party is insuring the shipment. Defaults to carrier-provided insurance.
   */
  insuranceProvider?: InsuranceProvider;

  /**
   * Customs declarations for this package. Usually only needed for international shipments.
   */
  customs?: CustomsPOJO;

  /**
   * Describes the items inside the package
   */
  contents: ReadonlyArray<SalesOrderPackageItemPOJO>;
}


/**
 * A package that contains items from one or more sales orders
 */
export interface SalesOrderPackage extends PackageIdentifier {
  /**
   * The URL of a webpage where the customer can track the package
   */
  readonly trackingURL?: URL;

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
   * Indicates which party is insuring the shipment. Defaults to carrier-provided insurance.
   */
  readonly insuranceProvider: InsuranceProvider;

  /**
   * Customs declarations for this package. Usually only needed for international shipments.
   */
  readonly customs: Customs;

  /**
   * Describes the items inside the package
   */
  readonly contents: ReadonlyArray<SalesOrderPackageItem>;
}
