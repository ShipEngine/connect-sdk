import type { Country } from "../country";
import type { AddressPOJO } from "./address";
import type { GeoCoordinate } from "./geo-coordinate";

/**
 * A partial/incomplete mailing address. All fields are optional.
 */
export type PartialAddressPOJO = Partial<AddressPOJO>;


/**
 * A partial/incomplete mailing address
 */
export interface PartialAddress {
  readonly company: string;
  readonly addressLines: ReadonlyArray<string>;
  readonly cityLocality: string;
  readonly stateProvince: string;
  readonly postalCode: string;
  readonly country?: Country;
  readonly isResidential?: boolean;
  readonly coordinates?: GeoCoordinate;
}
