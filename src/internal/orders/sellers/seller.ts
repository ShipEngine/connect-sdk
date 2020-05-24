import { Seller as ISeller, SellerPOJO } from "../../../public";
import { ContactInfo, hideAndFreeze, Joi, _internal } from "../../common";
import { SellerIdentifier, SellerIdentifierBase } from "./seller-identifier";
import { Store } from "./store";

export class Seller extends SellerIdentifierBase implements ISeller {
  public static readonly [_internal] = {
    label: "seller",
    schema: SellerIdentifier[_internal].schema.keys({
      store: Store[_internal].schema.required(),
      contact: ContactInfo[_internal].schema,
      metadata: Joi.object(),
    }),
  };

  public readonly store: Store;
  public readonly contact?: ContactInfo;
  public readonly metadata: object;

  public constructor(pojo: SellerPOJO) {
    super(pojo);

    this.store = new Store(pojo.store);
    this.contact = pojo.contact && new ContactInfo(pojo.contact);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
