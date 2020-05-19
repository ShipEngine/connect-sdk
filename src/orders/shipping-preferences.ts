import { DateTimeZone, DateTimeZonePOJO, DeliveryConfirmationType, MonetaryValue, MonetaryValuePOJO } from "../common";
import { hideAndFreeze, Joi, _internal } from "../common/internal";


/**
 * Preferences about how a sales order or item should be shipped
 */
export interface ShippingPreferencesPOJO {
  /**
   * The requested delivery confirmation
   */
  deliveryConfirmationType?: DeliveryConfirmationType;

  /**
   * The date and time that the shipment should be delivered
   */
  deliveryDateTime?: DateTimeZonePOJO | Date | string;

  /**
   * Indicates whether expedited shipping is requested
   */
  expeditedService?: boolean;

  /**
   * Indicates whether the shipment needs to be marked as containing alcohol
   */
  containsAlcohol?: boolean;

  /**
   * Indicates whether Saturday delivery is reqeusted
   */
  saturdayDelivery?: boolean;

  /**
   * Requests that the shipment be insured for the specified value
   */
  insuredValue?: MonetaryValuePOJO;
}


/**
 * Preferences about how a sales order or item should be shipped
 */
export class ShippingPreferences {
  //#region Private/Internal Fields

  /** @internal */
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

  //#endregion
  //#region Public Fields

  /**
   * The requested delivery confirmation
   */
  public readonly deliveryConfirmationType?: DeliveryConfirmationType;

  /**
   * The date and time that the shipment should be delivered
   */
  public readonly deliveryDateTime?: DateTimeZone;

  /**
   * Indicates whether expedited shipping is requested
   */
  public readonly expeditedService: boolean;

  /**
   * Indicates whether the shipment needs to be marked as containing alcohol
   */
  public readonly containsAlcohol: boolean;

  /**
   * Indicates whether Saturday delivery is reqeusted
   */
  public readonly saturdayDelivery: boolean;

  /**
   * Requests that the shipment be insured for the specified value
   */
  public readonly insuredValue?: MonetaryValue;

  //#endregion

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

// Prevent modifications to the class
hideAndFreeze(ShippingPreferences);
