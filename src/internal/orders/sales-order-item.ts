import * as currency from "currency.js";
import { FulfillmentStatus, SalesOrderItem as ISalesOrderItem, SalesOrderItemPOJO } from "../../public";
import { calculateTotalCharges, Charge, createNotes, hideAndFreeze, Joi, MonetaryValue, Note, Quantity, Weight, _internal } from "../common";
import { ProductIdentifier } from "../products";
import { SalesOrderItemIdentifier, SalesOrderItemIdentifierBase } from "./sales-order-item-identifier";
import { ShippingPreferences } from "./shipping-preferences";

export class SalesOrderItem extends SalesOrderItemIdentifierBase implements ISalesOrderItem {
  public static readonly [_internal] = {
    label: "sales order item",
    schema: SalesOrderItemIdentifier[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      fulfillmentStatus: Joi.string().enum(FulfillmentStatus),
      product: ProductIdentifier[_internal].schema,
      quantity: Quantity[_internal].schema.required(),
      unitPrice: MonetaryValue[_internal].schema.required(),
      unitWeight: Weight[_internal].schema,
      itemURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      trackingURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      shippingPreferences: ShippingPreferences[_internal].schema,
      charges: Joi.array().min(1).items(Charge[_internal].schema),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public readonly name: string;
  public readonly description: string;
  public readonly fulfillmentStatus?: FulfillmentStatus;
  public readonly product?: ProductIdentifier;
  public readonly quantity: Quantity;
  public readonly unitPrice: MonetaryValue;
  public readonly totalPrice: MonetaryValue;
  public readonly unitWeight?: Weight;
  public readonly itemURL?: URL;
  public readonly trackingURL?: URL;
  public readonly shippingPreferences: ShippingPreferences;
  public readonly charges: ReadonlyArray<Charge>;
  public readonly totalCharges: MonetaryValue;
  public readonly totalAmount: MonetaryValue;
  public readonly notes: ReadonlyArray<Note>;
  public readonly metadata: object;

  public constructor(pojo: SalesOrderItemPOJO) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.fulfillmentStatus = pojo.fulfillmentStatus;
    this.product = pojo.product && new ProductIdentifier(pojo.product);
    this.quantity = new Quantity(pojo.quantity);
    this.unitPrice = new MonetaryValue(pojo.unitPrice);
    this.totalPrice = new MonetaryValue({
      value: currency(this.unitPrice.value).multiply(this.quantity.value).toString(),
      currency: this.unitPrice.currency,
    });
    this.unitWeight = pojo.unitWeight && new Weight(pojo.unitWeight);
    this.itemURL = pojo.itemURL ? new URL(pojo.itemURL as string) : undefined;
    this.trackingURL = pojo.trackingURL ? new URL(pojo.trackingURL as string) : undefined;
    this.shippingPreferences = new ShippingPreferences(pojo.shippingPreferences || {});
    this.charges = pojo.charges ? pojo.charges.map((charge) => new Charge(charge)) : [];
    this.totalCharges = calculateTotalCharges(this.charges);
    this.totalAmount = MonetaryValue.sum([this.totalPrice, this.totalCharges]);
    this.notes = createNotes(pojo.notes);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
