import * as currency from "currency.js";
import { SalesOrderItem as ISalesOrderItem, SalesOrderItem as SalesOrderItemPOJO } from "../../definitions";
import { createNotes, hideAndFreeze, Joi, MonetaryValue, Note, Weight, _internal } from "../common";
import { ProductIdentifier } from "../products";
import { SalesOrderItemIdentifier, SalesOrderItemIdentifierBase } from "./sales-order-item-identifier";

export class SalesOrderItem extends SalesOrderItemIdentifierBase implements ISalesOrderItem {
  public static [_internal] = {
    label: "sales order item",
    schema: SalesOrderItemIdentifier[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      product: ProductIdentifier[_internal].schema.required(),
      quantity: Joi.number().required(),
      unitPrice: MonetaryValue[_internal].schema.required(),
      unitWeight: Weight[_internal].schema,
      itemURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      thumbnailURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public name: string;
  public description: string;
  public product: ProductIdentifier;
  public quantity: Number;
  public unitPrice: MonetaryValue;
  public totalPrice: MonetaryValue;
  public unitWeight?: Weight;
  public itemURL?: URL;
  public thumbnailURL?: URL;

  public notes: Array<Note>;
  public metadata: object;

  public constructor(pojo: SalesOrderItemPOJO) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.product = new ProductIdentifier(pojo.product);
    this.quantity = pojo.quantity;
    this.unitPrice = new MonetaryValue(pojo.unitPrice);
    this.totalPrice = new MonetaryValue({
      value: currency(this.unitPrice.value).multiply(this.quantity as number).toString(),
      currency: this.unitPrice.currency,
    });
    this.unitWeight = pojo.unitWeight && new Weight(pojo.unitWeight);
    this.itemURL = pojo.itemURL ? pojo.itemURL : undefined;
    this.thumbnailURL = pojo.thumbnailURL ? pojo.thumbnailURL : undefined;
    this.notes = createNotes(pojo.notes);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
