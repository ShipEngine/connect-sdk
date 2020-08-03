import { DeliveryConfirmationType, ShippingPreferences as IShippingPreferences, ShippingPreferences as ShippingPreferencesPOJO } from "../../definitions";
import { DateTimeZone, hideAndFreeze, Joi, MonetaryValue, _internal } from "../common";

export class ShippingPreferences implements IShippingPreferences {
  public static [_internal] = {
    label: "shipping preferences",
    schema: Joi.object({
      deliveryConfirmationType: Joi.string().enum(DeliveryConfirmationType),
      deliveryDateTime: DateTimeZone[_internal].schema,
      containsAlcohol: Joi.boolean(),
      saturdayDelivery: Joi.boolean(),
      insuredValue: MonetaryValue[_internal].schema,
    }),
  };

  public deliveryConfirmationType?: DeliveryConfirmationType;
  public deliveryDateTime?: DateTimeZone;
  public containsAlcohol: boolean;
  public saturdayDelivery: boolean;
  public insuredValue?: MonetaryValue;

  public constructor(pojo: ShippingPreferencesPOJO) {
    this.deliveryConfirmationType = pojo.deliveryConfirmationType;
    this.deliveryDateTime = pojo.deliveryDateTime ? new DateTimeZone(pojo.deliveryDateTime) : undefined;
    this.containsAlcohol = pojo.containsAlcohol || false;
    this.saturdayDelivery = pojo.saturdayDelivery || false;
    this.insuredValue = pojo.insuredValue && new MonetaryValue(pojo.insuredValue);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
