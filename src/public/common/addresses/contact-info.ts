import type { PersonName } from "./person-name";

/**
 * A person's contact information
 */
export interface ContactInfo {
  name: PersonName;
  email: string;
  phoneNumber: string;
}
