import { Constructor, hideAndFreeze, Joi, _internal } from "../../../internal";
import { ContactInfoPOJO } from "../../../pojos/common";
import { PersonName } from "./person-name";

/**
 * A person's contact information
 */
export class ContactInfo extends contactInfoMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "contact info",
    schema: Joi.object({
      name: Joi.alternatives(
        Joi.string().trim().singleLine().min(1).max(100),
        PersonName[_internal].schema
      ).required(),
      email: Joi.string().email().allow(""),
      phoneNumber: Joi.string().trim().singleLine().allow("").max(30),
      phoneNumberExtension: Joi.string().trim().singleLine().allow("").max(30),
    }),
  };

  //#endregion

  public constructor(pojo: ContactInfoPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(ContactInfo);

/**
 * Extends a base class with contact information
 * @internal
 */
export function contactInfoMixin(base: Constructor = Object) {
  return class ContactInfoMixin extends base {
    //#region Public Fields

    public readonly name: PersonName;
    public readonly email: string;
    public readonly phoneNumber: string;
    public readonly phoneNumberExtension: string;

    //#endregion

    public constructor(pojo: ContactInfoPOJO) {
      base === Object ? super() : super(pojo);

      this.name = new PersonName(pojo.name);
      this.email = pojo.email || "";
      this.phoneNumber = pojo.phoneNumber || "";
      this.phoneNumberExtension = pojo.phoneNumberExtension || "";
    }
  };
}
