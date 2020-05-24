import { DeliveryConfirmationType, ShippingPreferences as IShippingPreferences, ShippingPreferencesPOJO } from "../../public";
import { DateTimeZone, hideAndFreeze, Joi, MonetaryValue, _internal } from "../common";

export class ShippingPreferences implements IShippingPreferences {
  public static readonly [_internal] = {
    label: "shipping preferences",
    schema: Joi.object({
      deliveryConfirmationType: Joi.string().enum(DeliveryConfirmationType),
      deliveryDateTime: DateTimeZone[_internal].schema,
      expeditedService: Joi.boolean(),
      containsAlcohol: Joi.boolean(),
      saturdayDelivery: Joi.boolean(),
      insuredValue: MonetaryValue[_internal].schema,
    }),
  };

  public readonly deliveryConfirmationType?: DeliveryConfirmationType;
  public readonly deliveryDateTime?: DateTimeZone;
  public readonly expeditedService: boolean;
  public readonly containsAlcohol: boolean;
  public readonly saturdayDelivery: boolean;
  public readonly insuredValue?: MonetaryValue;

  public constructor(pojo: ShippingPreferencesPOJO) {
    this.deliveryConfirmationType = pojo.deliveryConfirmationType;
    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.expeditedService = pojo.expeditedService || false;
    this.containsAlcohol = pojo.containsAlcohol || false;
    this.saturdayDelivery = pojo.saturdayDelivery || false;
    this.insuredValue = pojo.insuredValue && new MonetaryValue(pojo.insuredValue);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
