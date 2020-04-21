import { Country } from "../countries";
import { ContactInfoConfig } from "./contact-info-config";

/**
 * A mailing address
 */
export interface AddressConfig {
  company?: string;
  addressLines: string[];
  cityLocality: string;
  stateProvince: string;
  postalCode: string;
  country: Country;
  isResidential?: boolean;
  coordinates?: GeoCoordinateConfig;
}

/**
 * A mailing address with a person's contact info
 */
export interface AddressWithContactInfoConfig extends AddressConfig, ContactInfoConfig {}

/**
 * The geo coordinates of a location on Earth
 */
export interface GeoCoordinateConfig {
  /**
   * The latitude of the point. Represented as signed degrees between -90.0 and +90.0.
   *
   * @see http://www.geomidpoint.com/latlon.html
   */
  latitude: number;

  /**
   * The longitude of the point. Represented as signed degrees between -180.0 and +180.0.
   *
   * @see http://www.geomidpoint.com/latlon.html
   */
  longitude: number;
}
