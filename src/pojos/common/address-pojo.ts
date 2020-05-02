import { Country } from "../../enums";

/**
 * A mailing address
 */
export interface AddressPOJO {
  company?: string;
  addressLines: string[];
  cityLocality: string;
  stateProvince: string;
  postalCode: string;
  country: Country;
  isResidential?: boolean;
  coordinates?: GeoCoordinatePOJO;
}

/**
 * A mailing address with a person's contact info
 */
export interface AddressWithContactInfoPOJO extends AddressPOJO, ContactInfoPOJO {}

/**
 * The geo coordinates of a location on Earth
 */
export interface GeoCoordinatePOJO {
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

/**
 * A person's contact information
 */
export interface ContactInfoPOJO {
  name: string | PersonNamePOJO;
  email?: string;
  phoneNumber?: string;
  phoneNumberExtension?: string;
}

/**
 * A person's name that has been parsed into separate fields.
 */
export interface PersonNamePOJO {
  first: string;
  last: string;
}
