import type { PersonName, PersonNamePOJO } from "./person-name";

/**
 * A person's contact information
 */
export interface ContactInfoPOJO {
  name: string | PersonNamePOJO;
  email?: string;
  phoneNumber?: string;
  // Addresses in the platform combine extensions with the base number
  // phoneNumberExtension?: string;
}

/**
 * A person's contact information
 */
export interface ContactInfo {
  readonly name: PersonName;
  readonly email: string;
  readonly phoneNumber: string;
  readonly phoneNumberExtension: string;
}
