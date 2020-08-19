import { AppType, Connect, ErrorCode, GetSalesOrdersByDate, OrderAppDefinition, ShipmentCancelled, ShipmentCreated } from "../../public";
import { AppPOJO, ConnectionApp, error, FormPOJO, hideAndFreeze, Joi, Transaction, TransactionPOJO, validate, _internal } from "../common";
import { SalesOrder } from "./sales-order";
import { SalesOrderTimeRange, SalesOrderTimeRangePOJO } from "./sales-order-time-range";
import { SalesOrderShipment, SalesOrderShipmentPOJO } from "./shipments/sales-order-shipment";
import { getAsyncIterable } from "./utils";

const _private = Symbol("private fields");


export interface OrderAppPOJO extends OrderAppDefinition, AppPOJO {
  connectionForm: FormPOJO;
  settingsForm?: FormPOJO;
  connect?: Connect;
  getSalesOrdersByDate?: GetSalesOrdersByDate;
  shipmentCreated?: ShipmentCreated;
  shipmentCancelled?: ShipmentCancelled;
}


export class OrderApp extends ConnectionApp {
  public static readonly [_internal] = {
    label: "ShipEngine Connect order app",
    schema: ConnectionApp[_internal].schema.keys({
      getSalesOrdersByDate: Joi.function(),
      shipmentCreated: Joi.function(),
      shipmentCancelled: Joi.function(),
      sendMail: Joi.boolean(),
      canConfigureTimeZone: Joi.boolean()
    }),
  };

  private readonly [_private]: {
    readonly getSalesOrdersByDate?: GetSalesOrdersByDate;
    readonly shipmentCreated?: ShipmentCreated;
    readonly shipmentCancelled?: ShipmentCancelled;
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
      shipmentCancelled: pojo.shipmentCancelled ? pojo.shipmentCancelled : (this.shipmentCancelled = undefined),
    };

    // Make this object immutable
    hideAndFreeze(this);

    this[_internal].references.add(this);
    this[_internal].references.finishedLoading();
  }

  public async* getSalesOrdersByDate?(
    transaction: TransactionPOJO, range: SalesOrderTimeRangePOJO): AsyncGenerator<SalesOrder> {

    let _transaction, _range;
    let { getSalesOrdersByDate } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _range = new SalesOrderTimeRange(validate(range, SalesOrderTimeRange));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the getSalesOrdersByDate method.", { originalError });
    }

    try {
      let salesOrders = await getSalesOrdersByDate!(_transaction, _range);
      let iterable = getAsyncIterable(salesOrders);

      if (!iterable) {
        throw error(ErrorCode.AppError, "The return value is not iterable");
      }

      for await (let salesOrder of iterable) {
        yield new SalesOrder(validate(salesOrder, SalesOrder));
      }
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error((originalError.code || ErrorCode.AppError), "Error in the getSalesOrdersByDate method.", { originalError, transactionID });
    }
  }

  public async shipmentCreated?(transaction: TransactionPOJO, shipment: SalesOrderShipmentPOJO): Promise<void> {
    let _transaction, _shipment;
    let { shipmentCreated } = this[_private];

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
      let transactionID = _transaction.id;
      throw error((originalError.code || ErrorCode.AppError), "Error in the shipmentCreated method.", { originalError, transactionID });
    }
  }

  public async shipmentCancelled?(transaction: TransactionPOJO, shipment: SalesOrderShipmentPOJO): Promise<void> {
    let _transaction, _shipment;
    let { shipmentCancelled } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _shipment = new SalesOrderShipment(validate(shipment, SalesOrderShipment));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the shipmentCancelled method.", { originalError });
    }

    try {
      await shipmentCancelled!(_transaction, _shipment);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error((originalError.code || ErrorCode.AppError), "Error in the shipmentCancelled method.", { originalError, transactionID });
    }
  }
}
