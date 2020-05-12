import { Country } from "../../../enums";
import { hideAndFreeze, Joi, _internal } from "../../../internal";
import { AddressPOJO } from "../../../pojos/common";
import { PartialAddress } from "./partial-address";

/**
 * A mailing address
 */
export class Address extends PartialAddress {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "address",
    schema: PartialAddress[_internal].schema.keys({
      addressLines: Joi.array().min(1).items(Joi.string().trim().singleLine().min(1).max(100)).required(),
      cityLocality: Joi.string().trim().singleLine().min(1).max(100).required(),
      stateProvince: Joi.string().trim().singleLine().min(1).max(100).required(),
      postalCode: Joi.string().trim().singleLine().min(1).max(100).required(),
      country: Joi.string().enum(Country).required(),
      timeZone: Joi.string().timeZone().required(),
    }),
  };

  //#endregion
  //#region Public Fields

  public readonly country!: Country;
  public readonly timeZone!: string;

  //#endregion

  public constructor(pojo: AddressPOJO) {
    super(pojo);

    // Make this object immutable
    hideAndFreeze(this);
  }

  /**
   * Returns the formatted address
   */
  public toString(): string {
    let address = [];
    this.company && address.push(this.company);
    address.push(...this.addressLines);
    address.push(`${this.cityLocality}, ${this.stateProvince} ${this.postalCode}`);
    address.push(this.country);
    return address.join("\n");
  }
}

// Prevent modifications to the class
hideAndFreeze(Address);
