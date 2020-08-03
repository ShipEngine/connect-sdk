import { Warehouse as IWarehouse, Warehouse as WarehousePOJO } from "../../../definitions";
import { Address, hideAndFreeze, Identifiers, Joi, _internal } from "../../common";

export class Warehouse implements IWarehouse {
  public static [_internal] = {
    label: "warehouse",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
      name: Joi.string().trim().singleLine().allow("").max(100),
      shipFrom: Address[_internal].schema.required(),
      returnTo: Address[_internal].schema,
    }),
  };

  public id: string;
  public identifiers: Identifiers;
  public name: string;
  public shipFrom: Address;
  public returnTo: Address;

  public constructor(pojo: WarehousePOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
    this.name = pojo.name || "";
    this.shipFrom = new Address(pojo.shipFrom);
    this.returnTo = pojo.returnTo ? new Address(pojo.returnTo) : this.shipFrom;

    // Make this object immutable
    hideAndFreeze(this);
  }
}
