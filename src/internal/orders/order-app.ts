import { AcknowledgeOrders, AppType, Connect, ErrorCode, GetSalesOrdersByDate, OrderAppDefinition, SalesOrders as SalesOrdersPOJO, ShipmentCreated } from "../../public";
import { AppPOJO, ConnectionApp, error, FormPOJO, hideAndFreeze, Joi, SystemErrorCode, Transaction, TransactionPOJO, _internal, OAuthConfigPOJO } from "../common";
import { AcknowledgedSalesOrder } from "./acknowledged-sales-order";
import { SalesOrderNotification, SalesOrderNotificationPOJO } from "./sales-order-notification";
import { SalesOrderTimeRange, SalesOrderTimeRangePOJO } from "./sales-order-time-range";
import { SalesOrders } from "./sales-orders";
import { SalesOrderShipment, SalesOrderShipmentPOJO } from "./shipments/sales-order-shipment";

const _private = Symbol("private fields");


export interface OrderAppPOJO extends OrderAppDefinition, AppPOJO {
  connectionForm: FormPOJO;
  settingsForm?: FormPOJO;
  connect?: Connect;
  oauthConfig?: OAuthConfigPOJO;
  getSalesOrdersByDate?: GetSalesOrdersByDate;
  shipmentCreated?: ShipmentCreated;
  acknowledgeOrders?: AcknowledgeOrders;
}


export class OrderApp extends ConnectionApp {
  public static readonly [_internal] = {
    label: "ShipEngine Connect order app",
    schema: ConnectionApp[_internal].schema.keys({
      getSalesOrdersByDate: Joi.function(),
      shipmentCreated: Joi.function(),
      acknowledgeOrders: Joi.function(),
      sendMail: Joi.boolean(),
      canConfigureTimeZone: Joi.boolean()
    }),
  };

  private readonly [_private]: {
    readonly getSalesOrdersByDate?: GetSalesOrdersByDate;
    readonly shipmentCreated?: ShipmentCreated;
    readonly acknowledgeOrders?: AcknowledgeOrders;
  };

  public readonly type: AppType;
  public readonly sendMail: boolean;
  public readonly canConfigureTimeZone: boolean;


  public constructor(pojo: OrderAppPOJO) {

    super(pojo);

    this.type = AppType.Order;
    this.sendMail = pojo.sendMail || false;
    this.canConfigureTimeZone = pojo.canConfigureTimeZone || false;

    this[_private] = {
      getSalesOrdersByDate:
        pojo.getSalesOrdersByDate ? pojo.getSalesOrdersByDate : (this.getSalesOrdersByDate = undefined),
      shipmentCreated: pojo.shipmentCreated ? pojo.shipmentCreated : (this.shipmentCreated = undefined),
      acknowledgeOrders: pojo.acknowledgeOrders ? pojo.acknowledgeOrders : (this.acknowledgeOrders = undefined),
    };

    // Make this object immutable
    hideAndFreeze(this);

    this[_internal].references.add(this);
    this[_internal].references.finishedLoading();
  }

  public async getSalesOrdersByDate?(
    transaction: TransactionPOJO, range: SalesOrderTimeRangePOJO): Promise<SalesOrders> {

    let _transaction, _range;
    const { getSalesOrdersByDate } = this[_private];

    try {
      _transaction = new Transaction(transaction);
      _range = new SalesOrderTimeRange(range);
    }
    catch (originalError: unknown) {
      throw error(SystemErrorCode.InvalidInput, "Invalid input to the getSalesOrdersByDate method.", { originalError });
    }

    try {
      const salesOrders = await getSalesOrdersByDate!(_transaction, _range);

      // Make sure to preserve the paging data returned from the app
      let salesOrderArrayPOJO: SalesOrdersPOJO = salesOrders;
      if (salesOrders && salesOrders.paging) {
        salesOrderArrayPOJO = Object.assign(salesOrders, { paging: salesOrders.paging });
      }

      return new SalesOrders(salesOrderArrayPOJO);
    }
    catch (originalError: unknown) {
      const transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the getSalesOrdersByDate method.", { originalError, transactionID });
    }
  }

  public async shipmentCreated?(transaction: TransactionPOJO, shipment: SalesOrderShipmentPOJO): Promise<void> {
    let _transaction, _shipment;
    const { shipmentCreated } = this[_private];

    try {
      _transaction = new Transaction(transaction);
      _shipment = new SalesOrderShipment(shipment);
    }
    catch (originalError: unknown) {
      throw error(SystemErrorCode.InvalidInput, "Invalid input to the shipmentCreated method.", { originalError });
    }

    try {
      await shipmentCreated!(_transaction, _shipment);
    }
    catch (originalError: unknown) {
      const transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the shipmentCreated method.", { originalError, transactionID });
    }
  }

  public async acknowledgeOrders?(transaction: TransactionPOJO, notifications: SalesOrderNotificationPOJO[]): Promise<AcknowledgedSalesOrder[]> {
    let _transaction;
    const _notifications: SalesOrderNotification[] = [];
    const { acknowledgeOrders } = this[_private];

    try {
      _transaction = new Transaction(transaction);

      if (notifications.length === 0) {
        throw error(SystemErrorCode.InvalidInput, "Sales Order Notifications are required");
      }

      for (const notification of notifications) {
        _notifications.push(new SalesOrderNotification(notification));
      }
    }
    catch (originalError: unknown) {
      throw error(SystemErrorCode.InvalidInput, "Invalid input to the acknowledgeOrders method.", { originalError });
    }

    try {
      const acknowledgedOrdersPOJO = await acknowledgeOrders!(_transaction, _notifications);
      const acknowledgedOrders: AcknowledgedSalesOrder[] = [];

      for (const acknowledgedOrderPOJO of acknowledgedOrdersPOJO) {
        acknowledgedOrders.push(new AcknowledgedSalesOrder(acknowledgedOrderPOJO));
      }

      return acknowledgedOrders;
    }
    catch (originalError: unknown) {
      const transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the acknowledgeOrders method.", { originalError, transactionID });
    }
  }
}
