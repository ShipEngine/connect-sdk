import { Store as IStore, Store as StorePOJO } from "../../../definitions";
import { hideAndFreeze, Identifiers, Joi, _internal } from "../../common";
import { Warehouse } from "./warehouse";

export class Store implements IStore {
  public static [_internal] = {
    label: "store",
    schema: Joi.object({
      id: Joi.string().trim().singleLine().min(1).max(100).required(),
      identifiers: Identifiers[_internal].schema,
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      warehouses: Joi.array().items(Warehouse[_internal].schema),
    }),
  };

  public id: string;
  public identifiers: Identifiers;
  public name: string;
  public warehouses: Array<Warehouse>;

  public constructor(pojo: StorePOJO) {
    this.id = pojo.id;
    this.identifiers = new Identifiers(pojo.identifiers);
    this.name = pojo.name;
    this.warehouses = pojo.warehouses ? pojo.warehouses.map((wh) => new Warehouse(wh)) : [];

    // Make this object immutable
    hideAndFreeze(this);
  }
}
