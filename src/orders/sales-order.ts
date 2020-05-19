import { AddressWithContactInfo, Charge, DateTimeZone, Note } from "../common";
import { createNotes, hideAndFreeze, Joi, _internal } from "../common/internal";
import { Buyer } from "./buyer";
import { FulfillmentStatus, PaymentMethod, PaymentStatus, SalesOrderStatus } from "./enums";
import { SalesOrderIdentifier, salesOrderIdentifierMixin } from "./sales-order-identifier";
import { SalesOrderItem } from "./sales-order-item";
import { SalesOrderPOJO } from "./sales-order-pojo";
import { SellerIdentifier } from "./sellers/seller-identifier";
import { ShippingPreferences } from "./shipping-preferences";


/**
 * A sales order
 */
export class SalesOrder extends salesOrderIdentifierMixin() {
  //#region Private/Internal Fields

  /** @internal */
  public static readonly [_internal] = {
    label: "sales order",
    schema: SalesOrderIdentifier[_internal].schema.keys({
      createdDateTime: DateTimeZone[_internal].schema.required(),
      modifiedDateTime: DateTimeZone[_internal].schema,
      status: Joi.string().enum(SalesOrderStatus).required(),
      fulfillmentStatus: Joi.string().enum(FulfillmentStatus),
      paymentStatus: Joi.string().enum(PaymentStatus),
      paymentMethod: Joi.string().enum(PaymentMethod),
      orderURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      shipTo: AddressWithContactInfo[_internal].schema.required(),
      seller: SellerIdentifier[_internal].schema.required(),
      buyer: Buyer[_internal].schema.required(),
      shippingPreferences: ShippingPreferences[_internal].schema,
      charges: Joi.array().min(1).items(Charge[_internal].schema).required(),
      items: Joi.array().min(1).items(SalesOrderItem[_internal].schema).required(),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  //#endregion
  //#region Public Fields

  /**
   * The date/time that the sales order was originally placed
   */
  public readonly createdDateTime: DateTimeZone;

  /**
   * The date/time that the sales order was last updated.
   */
  public readonly modifiedDateTime: DateTimeZone;

  /**
   * The current status
   */
  public readonly status: SalesOrderStatus;

  /**
   * Indicates whether the order has been fulfilled
   */
  public readonly fulfillmentStatus?: FulfillmentStatus;

  /**
   * Indicates whether the customer has paid for the order
   */
  public readonly paymentStatus?: PaymentStatus;

  /**
   * Indicates how the customer has paid for the order
   */
  public readonly paymentMethod?: PaymentMethod;

  /**
   * The URL of a webpage where the customer can view the order
   */
  public readonly orderURL?: URL;

  /**
   * The address where the order should be shipped
   */
  public readonly shipTo: AddressWithContactInfo;

  /**
   * Identifies the seller who sold the order
   */
  public readonly seller: SellerIdentifier;

  /**
   * The buyer who bought the order. This is not necessarily the same person as the `shipTo`
   */
  public readonly buyer: Buyer;

  /**
   * Preferences on how this order should be fulfilled
   */
  public readonly shippingPreferences: ShippingPreferences;

  /**
   * The breakdown of charges for this sales order
   */
  public readonly charges: ReadonlyArray<Charge>;

  /**
   * The items in this sales order
   */
  public readonly items: ReadonlyArray<SalesOrderItem>;

  /**
   * Human-readable information regarding this sales order, such as gift notes, backorder notices, etc.
   */
  public readonly notes: ReadonlyArray<Note>;

  /**
   * Arbitrary data about this sales order that will be persisted by the ShipEngine Integration Platform.
   * Must be JSON serializable.
   */
  public readonly metadata: object;

  //#endregion

  public constructor(pojo: SalesOrderPOJO) {
    super(pojo);

    this.createdDateTime = new DateTimeZone(pojo.createdDateTime);
    this.modifiedDateTime = pojo.modifiedDateTime ? new DateTimeZone(pojo.createdDateTime) : this.createdDateTime;
    this.status = pojo.status;
    this.fulfillmentStatus = pojo.fulfillmentStatus;
    this.paymentStatus = pojo.paymentStatus;
    this.paymentMethod = pojo.paymentMethod;
    this.orderURL = pojo.orderURL ? new URL(pojo.orderURL as string) : undefined;
    this.shipTo = new AddressWithContactInfo(pojo.shipTo);
    this.seller = new SellerIdentifier(pojo.seller);
    this.buyer = new Buyer(pojo.buyer);
    this.shippingPreferences = new ShippingPreferences(pojo.shippingPreferences || {});
    this.charges = pojo.charges.map((charge) => new Charge(charge));
    this.items = pojo.items.map((item) => new SalesOrderItem(item));
    this.notes = createNotes(pojo.notes);
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}

// Prevent modifications to the class
hideAndFreeze(SalesOrder);
