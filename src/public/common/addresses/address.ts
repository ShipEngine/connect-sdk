import type { Country } from "../country";
import type { GeoCoordinate, GeoCoordinatePOJO } from "./geo-coordinate";

/**
 * A mailing address
 */
export interface AddressPOJO {
  company?: string;
  addressLines: ReadonlyArray<string>;
  cityLocality: string;
  stateProvince: string;
  postalCode: string;
  country: Country;
  isResidential?: boolean;
  // Addresses in the platform don't have this
  // coordinates?: GeoCoordinatePOJO;
}


/**
 * A mailing address
 */
export interface Address {
  readonly company: string;
  readonly addressLines: ReadonlyArray<string>;
  readonly cityLocality: string;
  readonly stateProvince: string;
  readonly postalCode: string;
  readonly country: Country;
  readonly isResidential?: boolean;
  readonly coordinates?: GeoCoordinate;

  /**
   * Returns the formatted address
   */
  toString(): string;
}
