import type { Address } from "./address";
import type { ContactInfo } from "./contact-info";

/**
 * A mailing address with a person's contact info
 */
export interface AddressWithContactInfo extends Address, ContactInfo {}
