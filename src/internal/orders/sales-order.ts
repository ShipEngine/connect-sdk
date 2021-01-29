import { PaymentMethod, PaymentStatus, SalesOrder as SalesOrderPOJO, SalesOrderStatus } from "../../public";
import { calculateTotalCharges, Charge, DateTimeZone, hideAndFreeze, Joi, MonetaryValue, Note, _internal } from "../common";
import { Buyer } from "./buyer";
import { OriginalOrderSource } from "./original-order-source";
import { RequestedFulfillment } from "./requested-fulfillment";
import { SalesOrderIdentifier, SalesOrderIdentifierBase } from "./sales-order-identifier";
import { ShippingPreferences } from "./shipping-preferences";

export class SalesOrder extends SalesOrderIdentifierBase {
  public static readonly [_internal] = {
    label: "sales order",
    schema: SalesOrderIdentifier[_internal].schema.keys({
      createdDateTime: DateTimeZone[_internal].schema.required(),
      lastModifiedDateTime: DateTimeZone[_internal].schema.optional(),
      status: Joi.string().enum(SalesOrderStatus).required(),
      paymentMethod: Joi.alternatives(Joi.string().enum(PaymentMethod), Joi.string()),
      paymentStatus: Joi.string().enum(PaymentStatus),
      orderURL: Joi.alternatives(Joi.object().website(), Joi.string().website()),
      buyer: Buyer[_internal].schema.required(),
      shippingPreferences: ShippingPreferences[_internal].schema,
      charges: Joi.array().min(1).items(Charge[_internal].schema),
      requestedFulfillments: Joi.array().min(1).items(RequestedFulfillment[_internal].schema),
      notes: Note[_internal].notesSchema,
      originalOrderSource: OriginalOrderSource[_internal].schema.optional(),
      metadata: Joi.object(),
    }),
  };

  public readonly createdDateTime: DateTimeZone;
  public readonly lastModifiedDateTime?: DateTimeZone;
  public readonly status: SalesOrderStatus;
  public readonly paymentMethod?: PaymentMethod | string;
  public readonly paymentStatus: PaymentStatus;
  public readonly orderURL?: URL;
  public readonly buyer: Buyer;

  public readonly charges: readonly Charge[];

  public readonly requestedFulfillments: Array<RequestedFulfillment>;

  public readonly totalCharges: MonetaryValue;
  public readonly notes: readonly Note[];
  public readonly originalOrderSource?: OriginalOrderSource;
  public readonly metadata: object;

  public constructor(pojo: SalesOrderPOJO) {
    super(pojo);

    this.createdDateTime = new DateTimeZone(pojo.createdDateTime);
    this.lastModifiedDateTime = pojo.lastModifiedDateTime ? new DateTimeZone(pojo.lastModifiedDateTime) : undefined;
    this.status = pojo.status;
    this.paymentMethod = pojo.paymentMethod;
    this.paymentStatus = pojo.paymentStatus || PaymentStatus.AwaitingPayment;
    this.orderURL = pojo.orderURL ? new URL(pojo.orderURL as string) : undefined;
    this.buyer = new Buyer(pojo.buyer);

    this.charges = pojo.charges ? pojo.charges.map((charge) => new Charge(charge)) : [];
    this.totalCharges = calculateTotalCharges(this.charges);

    this.requestedFulfillments = pojo.requestedFulfillments.map((requestedFulfillment) => {
      return new RequestedFulfillment(requestedFulfillment);
    });

    this.notes = pojo.notes || [];
    this.originalOrderSource = pojo.originalOrderSource ? new OriginalOrderSource(pojo.originalOrderSource) : undefined;
    this.metadata = pojo.metadata || {};

    // Make this object immutable
    hideAndFreeze(this);
  }
}
