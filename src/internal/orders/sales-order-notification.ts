import { hideAndFreeze, Joi, _internal, DateTimeZone } from "../common";
import { SalesOrderIdentifier, SalesOrderIdentifierBase } from "./sales-order-identifier";

export interface SalesOrderNotificationPOJO extends SalesOrderIdentifier {
  orderNumber: string;

  importedDate: DateTimeZone | Date | string;
}

export class SalesOrderNotification extends SalesOrderIdentifierBase{
  // TODO: Add better validation and unit tests
  public static readonly [_internal] = {
    label: "sales order notification",
    schema: SalesOrderIdentifier[_internal].schema.keys({
      orderNumber: Joi.string().required(),
      importedDate: DateTimeZone[_internal].schema.required()
    })
  };
  
  public readonly orderNumber: string;
  public readonly importedDate: DateTimeZone;

  public constructor(pojo: SalesOrderNotificationPOJO) {
    super(pojo);

    this.orderNumber = pojo.orderNumber;
    this.importedDate = new DateTimeZone(pojo.importedDate);

    // Make this object immutable
    hideAndFreeze(this);
  }
}
