import type { Country } from "../country";

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

  /**
   * Returns the formatted address
   */
  toString(): string;
}
