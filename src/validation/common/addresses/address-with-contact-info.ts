import { AddressWithContactInfo as IAddressWithContactInfo, AddressWithContactInfo as AddressWithContactInfoPOJO } from "../../../definitions";
import { hideAndFreeze, _internal } from "../utils";
import { Address, AddressBase } from "./address";
import { ContactInfo } from "./contact-info";
import { PersonName } from "./person-name";

export class AddressWithContactInfo extends AddressBase implements IAddressWithContactInfo {
  public static [_internal] = {
    label: "address",
    schema: Address[_internal].schema.concat(ContactInfo[_internal].schema),
  };

  public name: PersonName;
  public email: string;
  public phoneNumber: string;

  public constructor(pojo: AddressWithContactInfoPOJO) {
    super(pojo);

    this.name = new PersonName(pojo.name);
    this.email = pojo.email || "";
    this.phoneNumber = pojo.phoneNumber || "";

    // Make this object immutable
    hideAndFreeze(this);
  }
}
