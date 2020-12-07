import { PaymentMethod, PaymentStatus, SalesOrder as SalesOrderPOJO, SalesOrderStatus } from "../../public";
import { AddressWithContactInfo, calculateTotalCharges, Charge, DateTimeZone, hideAndFreeze, Joi, MonetaryValue, Note, _internal } from "../common";
import { Buyer } from "./buyer";
import { RequestedFulfillment } from "./requested-fulfillment";
import { SalesOrderIdentifier, SalesOrderIdentifierBase } from "./sales-order-identifier";
import { SalesOrderItem } from "./sales-order-item";
import { ShippingPreferences } from "./shipping-preferences";

export class SalesOrder extends SalesOrderIdentifierBase {
  public static readonly [_internal] = {
    label: "sales order",
    schema: SalesOrderIdentifier[_internal].schema.keys({
      createdDateTime: DateTimeZone[_internal].schema.required(),
      status: Joi.string().enum(SalesOrderStatus).required(),
      paymentMethod: Joi.string().enum(PaymentMethod),
      paymentStatus: Joi.string().enum(PaymentStatus),
      orderURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      buyer: Buyer[_internal].schema.required(),
      shippingPreferences: ShippingPreferences[_internal].schema,
      charges: Joi.array().min(1).items(Charge[_internal].schema),
      requestedFulfillments: Joi.array().min(1).items(RequestedFulfillment[_internal].schema),
      notes: Note[_internal].notesSchema,
      metadata: Joi.object(),
    }),
  };

  public readonly createdDateTime: DateTimeZone;
  public readonly status: SalesOrderStatus;
  public readonly paymentMethod?: PaymentMethod;
  public readonly paymentStatus: PaymentStatus;
  public readonly orderURL?: URL;
  public readonly buyer: Buyer;

  public readonly charges: readonly Charge[];

  public readonly requestedFulfillments: Array<RequestedFulfillment>;

  public readonly totalCharges: MonetaryValue;
  public readonly notes: readonly Note[];
  public readonly metadata: object;

  public constructor(pojo: SalesOrderPOJO) {
    super(pojo);

    this.createdDateTime = new DateTimeZone(pojo.createdDateTime);
    this.status = pojo.status;
    this.paymentMethod = pojo.paymentMethod;
    this.paymentStatus = pojo.paymentStatus || PaymentStatus.AwaitingPayment;
    this.orderURL = pojo.orderURL ? new URL(pojo.orderURL as string) : undefined;
    this.buyer = new Buyer(pojo.buyer);
    
    this.charges = pojo.charges ? pojo.charges.map((charge) => new Charge(charge)) : [];
    this.totalCharges = calculateTotalCharges(this.charges);
    
    this.requestedFulfillments = pojo.requestedFulfillments.map((requestedFulfillment) => {
      return new RequestedFulfillment({
        items: requestedFulfillment.items.map((item) => new SalesOrderItem(item)),
        shippingPreferences: new ShippingPreferences(requestedFulfillment.shippingPreferences || {}),
        shipTo: new AddressWithContactInfo(requestedFulfillment.shipTo),
        extensions: requestedFulfillment.extensions
      });
    });

    this.notes = pojo.notes || [];
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
