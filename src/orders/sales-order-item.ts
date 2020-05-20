import * as currency from "currency.js";
import { Charge, MonetaryValue, Note, Quantity, Weight } from "../common";
import { calculateTotalCharges, createNotes, hideAndFreeze, Joi, _internal } from "../common/internal";
import { ProductIdentifier } from "../products";
import { FulfillmentStatus } from "./enums";
import { SalesOrderItemIdentifier, SalesOrderItemIdentifierBase } from "./sales-order-item-identifier";
import { SalesOrderItemPOJO } from "./sales-order-item-pojo";
import { ShippingPreferences } from "./shipping-preferences";


/**
 * An item in a sales order
 */
export class SalesOrderItem extends SalesOrderItemIdentifierBase {
  //#region Private/Internal Fields

  /** @internal */
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

  //#endregion
  //#region Public Fields

  /**
   * The user-friendly name of the item. This is often the same as the product name.
   */
  public readonly name: string;

  /**
   * A short description of the item. This is often the same as the product summary.
   */
  public readonly description: string;

  /**
   * Indicates whether the order item has been fulfilled
   */
  public readonly fulfillmentStatus?: FulfillmentStatus;

  /**
   * The product associated with this item
   */
  public readonly product?: ProductIdentifier;

  /**
   * The quantity of this item in the sales order
   */
  public readonly quantity: Quantity;

  /**
   * The sale price of each item. This should NOT include additional charges or adjustments,
   * such as taxes or discounts. Use `charges` for those.
   */
  public readonly unitPrice: MonetaryValue;

  /**
   * The total price of this item. This is `unitPrice` multiplied by `quantity`.
   */
  public readonly totalPrice: MonetaryValue;

  /**
   * The weight of each item
   */
  public readonly unitWeight?: Weight;

  /**
   * The URL of a webpage where the customer can view the order item
   */
  public readonly itemURL?: URL;

  /**
   * The URL of a webpage where the customer can track the package
   */
  public readonly trackingURL?: URL;

  /**
   * Preferences on how this item should be shipped
   */
  public readonly shippingPreferences: ShippingPreferences;

  /**
   * The breakdown of charges for this order item
   */
  public readonly charges: ReadonlyArray<Charge>;

  /**
   * The total cost of all charges for this order item
   */
  public readonly totalCharges: MonetaryValue;

  /**
   * The total amount of the order item. This is `totalPrice` plus `totalCharges`.
   */
  public readonly totalAmount: MonetaryValue;

  /**
   * Human-readable information regarding this order item, such as gift notes, backorder notices, etc.
   */
  public readonly notes: ReadonlyArray<Note>;

  /**
   * Arbitrary data about this order item that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion

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

// Prevent modifications to the class
hideAndFreeze(SalesOrderItem);
