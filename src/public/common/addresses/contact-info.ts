import type { PersonName, PersonNamePOJO } from "./person-name";

/**
 * A person's contact information
 */
export interface ContactInfoPOJO {
  name: string | PersonNamePOJO;
  email?: string;
  phoneNumber?: string;
}

/**
 * A person's contact information
 */
export interface ContactInfo {
  readonly name: PersonName;
  readonly email: string;
  readonly phoneNumber: string;
}
