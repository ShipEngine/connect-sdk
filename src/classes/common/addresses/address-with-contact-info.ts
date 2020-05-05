import { hideAndFreeze, _internal } from "../../../internal";
import { AddressWithContactInfoPOJO } from "../../../pojos/common";
import { Address, addressMixin } from "./address";
import { ContactInfo, contactInfoMixin } from "./contact-info";

/**
 * A mailing address with a person's contact info
 */
export interface AddressWithContactInfo extends Address, ContactInfo {}

/**
 * A mailing address with a person's contact info
 */
export class AddressWithContactInfo extends addressMixin(contactInfoMixin()) {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "address",
    schema: Address[_internal].schema.concat(ContactInfo[_internal].schema),
  };

  //#endregion

  public constructor(pojo: AddressWithContactInfoPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(AddressWithContactInfo);
