import { AppType, OrderApp as IOrderApp, OrderApp as OrderAppPOJO } from "../../definitions";
import { ConnectionApp, hideAndFreeze, Joi, validate, _internal } from "../common";


export class OrderApp extends ConnectionApp implements IOrderApp {
  public static [_internal] = {
    label: "ShipEngine Integration Platform order app",
    schema: ConnectionApp[_internal].schema.keys({
      getSalesOrdersByDate: Joi.function(),
      shipmentCreated: Joi.function(),
      shipmentCancelled: Joi.function(),
    }),
  };


  public type: AppType;

  public constructor(pojo: OrderAppPOJO) {
    validate(pojo, OrderApp);

    super(pojo);

    this.type = AppType.Order;

    // Make this object immutable
    hideAndFreeze(this);

    this[_internal].references.add(this);
    this[_internal].references.finishedLoading();
  }
}
