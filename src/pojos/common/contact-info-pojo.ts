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
