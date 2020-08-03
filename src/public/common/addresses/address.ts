import type { Country } from "../country";
/**
 * A mailing address
 */
export interface Address {
  company: string;
  addressLines: Array<string>;
  cityLocality: string;
  stateProvince: string;
  postalCode: string;
  country: Country;
  isResidential?: boolean;

  /**
   * Returns the formatted address
   */
  toString(): string;
}
