/**
 * A person's contact information
 */
export interface ContactInfoConfig {
  name: string | PersonNameConfig;
  email?: string;
  phoneNumber?: string;
  phoneNumberExtension?: string;
}

/**
 * A person's name that has been parsed into separate fields.
 */
export interface PersonNameConfig {
  first: string;
  last: string;
}
