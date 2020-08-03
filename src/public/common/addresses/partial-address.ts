import type { Country } from "../country";

/**
 * A partial/incomplete mailing address
 */
export interface PartialAddress {
  company: string;
  addressLines: Array<string>;
  cityLocality: string;
  stateProvince: string;
  postalCode: string;
  country?: Country;
  isResidential?: boolean;
}
