import type { Address, AddressPOJO } from "./address";
import type { ContactInfo, ContactInfoPOJO } from "./contact-info";

/**
 * A mailing address with a person's contact info
 */
export interface AddressWithContactInfoPOJO extends AddressPOJO, ContactInfoPOJO {}


/**
 * A mailing address with a person's contact info
 */
export interface AddressWithContactInfo extends Address, ContactInfo {}
