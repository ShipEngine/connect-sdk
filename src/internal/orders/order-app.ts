import { AppType, Connect, ErrorCode, GetSalesOrdersByDate, OrderAppDefinition, ShipmentCreated } from "../../public";
import { AppPOJO, ConnectionApp, error, FormPOJO, hideAndFreeze, Joi, Transaction, TransactionPOJO, validate, _internal } from "../common";
import { SalesOrderTimeRange, SalesOrderTimeRangePOJO } from "./sales-order-time-range";
import { SalesOrderShipment, SalesOrderShipmentPOJO } from "./shipments/sales-order-shipment";
import { SalesOrders } from "./sales-orders";
import { SalesOrders as SalesOrdersPOJO } from "../../public";

const _private = Symbol("private fields");


export interface OrderAppPOJO extends OrderAppDefinition, AppPOJO {
  connectionForm: FormPOJO;
  settingsForm?: FormPOJO;
  connect?: Connect;
  getSalesOrdersByDate?: GetSalesOrdersByDate;
  shipmentCreated?: ShipmentCreated;
}


export class OrderApp extends ConnectionApp {
  public static readonly [_internal] = {
    label: "ShipEngine Connect order app",
    schema: ConnectionApp[_internal].schema.keys({
      getSalesOrdersByDate: Joi.function(),
      shipmentCreated: Joi.function(),
      sendMail: Joi.boolean(),
      canConfigureTimeZone: Joi.boolean()
    }),
  };

  private readonly [_private]: {
    readonly getSalesOrdersByDate?: GetSalesOrdersByDate;
    readonly shipmentCreated?: ShipmentCreated;
  };

  public readonly type: AppType;
  public readonly sendMail: boolean;
  public readonly canConfigureTimeZone: boolean;


  public constructor(pojo: OrderAppPOJO) {
    validate(pojo, OrderApp);

    super(pojo);

    this.type = AppType.Order;
    this.sendMail = pojo.sendMail || false;
    this.canConfigureTimeZone = pojo.canConfigureTimeZone || false;

    this[_private] = {
      getSalesOrdersByDate:
        pojo.getSalesOrdersByDate ? pojo.getSalesOrdersByDate : (this.getSalesOrdersByDate = undefined),
      shipmentCreated: pojo.shipmentCreated ? pojo.shipmentCreated : (this.shipmentCreated = undefined),
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
      _transaction = new Transaction(validate(transaction, Transaction));
      _range = new SalesOrderTimeRange(validate(range, SalesOrderTimeRange));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the getSalesOrdersByDate method.", { originalError });
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
    catch (originalError) {
      const transactionID = _transaction.id;
      throw error((originalError.code || ErrorCode.AppError), "Error in the getSalesOrdersByDate method.", { originalError, transactionID });
    }
  }

  public async shipmentCreated?(transaction: TransactionPOJO, shipment: SalesOrderShipmentPOJO): Promise<void> {
    let _transaction, _shipment;
    const { shipmentCreated } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _shipment = new SalesOrderShipment(validate(shipment, SalesOrderShipment));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the shipmentCreated method.", { originalError });
    }

    try {
      await shipmentCreated!(_transaction, _shipment);
    }
    catch (originalError) {
      const transactionID = _transaction.id;
      throw error((originalError.code || ErrorCode.AppError), "Error in the shipmentCreated method.", { originalError, transactionID });
    }
  }
}
