import { ContactInfo as IContactInfo, ContactInfoPOJO } from "../../../public";
import { hideAndFreeze, _internal } from "../utils";
import { Joi } from "../validation";
import { PersonName } from "./person-name";

export class ContactInfoBase implements IContactInfo {
  public readonly name?: PersonName;
  public readonly email?: string;
  public readonly phoneNumber?: string;

  public constructor(pojo: ContactInfoPOJO) {
    if (pojo.name) {
      this.name = new PersonName(pojo.name);
    }

    this.email = pojo.email || "";
    this.phoneNumber = pojo.phoneNumber || "";
  }
}

export class ContactInfo extends ContactInfoBase {
  public static readonly [_internal] = {
    label: "contact info",
    schema: Joi.object({
      name: PersonName[_internal].schema.optional(),
      email: Joi.string().email().allow("").optional(),
      phoneNumber: Joi.string().trim().singleLine().allow("").max(30).optional()
    }),
  };

  public constructor(pojo: ContactInfoPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
