import { DeliveryConfirmationType, ShippingPreferences as ShippingPreferencesPOJO } from "../../public";
import { DateTimeZone, hideAndFreeze, Joi, MonetaryValue, _internal } from "../common";
import { OrderSourcePolicies } from "../orders/order-source-policies";

export class ShippingPreferences {
  public static readonly [_internal] = {
    label: "shipping preferences",
    schema: Joi.object({
      deliveryConfirmationType: Joi.string().enum(DeliveryConfirmationType),
      containsAlcohol: Joi.boolean(),
      saturdayDelivery: Joi.boolean(),
      isGift: Joi.boolean().optional(),
      insuredValue: MonetaryValue[_internal].schema,
      requestedShippingService: Joi.string(),
      deliverByDate: DateTimeZone[_internal].schema,
      shipByDate: DateTimeZone[_internal].schema,
      orderSourcePolicies: OrderSourcePolicies[_internal].schema,
      requestedWarehouse: Joi.string().optional().allow(""),
    }),
  };

  public readonly deliveryConfirmationType?: DeliveryConfirmationType;
  public readonly containsAlcohol: boolean;
  public readonly saturdayDelivery: boolean;
  public readonly isGift: boolean;
  public readonly requestedShippingService: string;
  public readonly insuredValue?: MonetaryValue;
  public readonly deliverByDate?: DateTimeZone;
  public readonly shipByDate?: DateTimeZone;
  public readonly orderSourcePolicies?: OrderSourcePolicies;
  public readonly requestedWarehouse?: string;

  public constructor(pojo: ShippingPreferencesPOJO) {
    this.deliveryConfirmationType = pojo.deliveryConfirmationType;
    this.containsAlcohol = pojo.containsAlcohol || false;
    this.saturdayDelivery = pojo.saturdayDelivery || false;
    this.isGift = pojo.isGift || false;
    this.insuredValue = pojo.insuredValue && new MonetaryValue(pojo.insuredValue);
    this.requestedShippingService = pojo.requestedShippingService || "";
    this.deliverByDate = pojo.deliverByDate ? new DateTimeZone(pojo.deliverByDate) : undefined;
    this.shipByDate = pojo.shipByDate ? new DateTimeZone(pojo.shipByDate) : undefined;
    this.orderSourcePolicies = pojo.orderSourcePolicies ? new OrderSourcePolicies(pojo.orderSourcePolicies) : undefined;
    this.requestedWarehouse = pojo.requestedWarehouse;
  
    // Make this object immutable
    hideAndFreeze(this);
  }
}
