import * as currency from "currency.js";
import { SalesOrderItem as SalesOrderItemPOJO } from "../../public";
import { hideAndFreeze, Joi, MonetaryValue, Quantity, Weight, _internal } from "../common";
import { ProductIdentifier } from "../products";
import { SalesOrderItemIdentifier, SalesOrderItemIdentifierBase } from "./sales-order-item-identifier";

export class SalesOrderItem extends SalesOrderItemIdentifierBase {
  public static readonly [_internal] = {
    label: "sales order item",
    schema: SalesOrderItemIdentifier[_internal].schema.keys({
      name: Joi.string().singleLine().min(1).required(),
      description: Joi.string().singleLine().allow(""),
      product: ProductIdentifier[_internal].schema.required(),
      quantity: Quantity[_internal].schema.required(),
      unitPrice: MonetaryValue[_internal].schema.required(),
      unitWeight: Weight[_internal].schema,
      itemURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      thumbnailURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      location: Joi.string().optional().allow(""),
    }),
  };

  public readonly name: string;
  public readonly description: string;
  public readonly product: ProductIdentifier;
  public readonly quantity: Quantity;
  public readonly unitPrice: MonetaryValue;
  public readonly totalPrice: MonetaryValue;
  public readonly unitWeight?: Weight;
  public readonly itemURL?: URL;
  public readonly thumbnailURL?: URL;
  public readonly location?: string;

  public constructor(pojo: SalesOrderItemPOJO) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.product = new ProductIdentifier(pojo.product);
    this.quantity = new Quantity(pojo.quantity);
    this.unitPrice = new MonetaryValue(pojo.unitPrice);
    this.totalPrice = new MonetaryValue({
      value: currency(this.unitPrice.value).multiply(this.quantity.value).value,
      currency: this.unitPrice.currency,
    });
    this.unitWeight = pojo.unitWeight && new Weight(pojo.unitWeight);
    this.itemURL = pojo.itemURL ? new URL(pojo.itemURL as string) : undefined;
    this.thumbnailURL = pojo.thumbnailURL ? new URL(pojo.thumbnailURL as string) : undefined;
    this.location = pojo.location;
    // Make this object immutable
    hideAndFreeze(this);
  }
}
