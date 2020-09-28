import { DeliveryConfirmationType, ShippingPreferences as ShippingPreferencesPOJO } from "../../public";
import { DateTimeZone, hideAndFreeze, Joi, MonetaryValue, _internal } from "../common";

export class ShippingPreferences {
  public static readonly [_internal] = {
    label: "shipping preferences",
    schema: Joi.object({
      deliveryConfirmationType: Joi.string().enum(DeliveryConfirmationType),
      containsAlcohol: Joi.boolean(),
      saturdayDelivery: Joi.boolean(),
      insuredValue: MonetaryValue[_internal].schema,
    }),
  };

  public readonly deliveryConfirmationType?: DeliveryConfirmationType;
  public readonly containsAlcohol: boolean;
  public readonly saturdayDelivery: boolean;
  public readonly requestedShippingService: string;
  public readonly insuredValue?: MonetaryValue;
  public readonly deliveryByDate?: DateTimeZone;

  public constructor(pojo: ShippingPreferencesPOJO) {
    this.deliveryConfirmationType = pojo.deliveryConfirmationType;
    this.containsAlcohol = pojo.containsAlcohol || false;
    this.saturdayDelivery = pojo.saturdayDelivery || false;
    this.insuredValue = pojo.insuredValue && new MonetaryValue(pojo.insuredValue);
    this.requestedShippingService = pojo.requestedShippingService || "";
    this.deliveryByDate = pojo.deliveryByDate ? new DateTimeZone(pojo.deliveryByDate) : undefined;
  
    // Make this object immutable
    hideAndFreeze(this);
  }
}
