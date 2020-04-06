import { Country } from "../countries";

/**
 * A mailing address
 */
export interface AddressConfig extends ContactInfoConfig {
  company?: string;
  addressLines: string[];
  cityLocality: string;
  stateProvince: string;
  postalCode: string;
  country: Country;
  isResidential?: boolean;
}

/**
 * A person's contact information
 */
export interface ContactInfoConfig {
  name: string | ParsedNameConfig;
  email?: string;
  phoneNumber?: string;
  phoneNumberExtension?: string;
}

/**
 * A person's name that has been parsed into separate fields.
 */
export interface ParsedNameConfig {
  first: string;
  last: string;
}
