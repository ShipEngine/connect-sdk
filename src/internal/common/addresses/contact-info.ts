import { ContactInfo as IContactInfo, ContactInfoPOJO } from "../../../public";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { PersonName } from "./person-name";

export class ContactInfoBase implements IContactInfo {
  public readonly name: PersonName;
  public readonly email: string;
  public readonly phoneNumber: string;
  public readonly phoneNumberExtension: string;

  public constructor(pojo: ContactInfoPOJO) {
    this.name = new PersonName(pojo.name);
    this.email = pojo.email || "";
    this.phoneNumber = pojo.phoneNumber || "";
    this.phoneNumberExtension = pojo.phoneNumberExtension || "";
  }
}

export class ContactInfo extends ContactInfoBase {
  public static readonly [_internal] = {
    label: "contact info",
    schema: Joi.object({
      name: PersonName[_internal].schema.required(),
      email: Joi.string().email().allow(""),
      phoneNumber: Joi.string().trim().singleLine().allow("").max(30),
      phoneNumberExtension: Joi.string().trim().singleLine().allow("").max(30),
    }),
  };

  public constructor(pojo: ContactInfoPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
