import { AppType, ErrorCode, GetSalesOrder, GetSalesOrdersByDate, OrderApp as IOrderApp, OrderAppPOJO, SalesOrderIdentifierPOJO, SalesOrderShipmentPOJO, SalesOrderTimeRangePOJO, SellerIdentifierPOJO, ShipmentCancelled, ShipmentCreated, TransactionPOJO } from "../../public";
import { ConnectionApp, error, hideAndFreeze, Joi, Transaction, validate, _internal } from "../common";
import { SalesOrder } from "./sales-order";
import { SalesOrderIdentifier } from "./sales-order-identifier";
import { SalesOrderTimeRange } from "./sales-order-time-range";
import { Seller } from "./sellers/seller";
import { SellerIdentifier } from "./sellers/seller-identifier";
import { SalesOrderShipment } from "./shipments/sales-order-shipment";
import { getAsyncIterable } from "./utils";

const _private = Symbol("private fields");

export class OrderApp extends ConnectionApp implements IOrderApp {
  public static readonly [_internal] = {
    label: "ShipEngine Integration Platform order app",
    schema: ConnectionApp[_internal].schema.keys({
      getSalesOrder: Joi.function(),
      getSalesOrdersByDate: Joi.function(),
      shipmentCreated: Joi.function(),
      shipmentCancelled: Joi.function(),
    }),
  };

  private readonly [_private]: {
    readonly getSalesOrder?: GetSalesOrder;
    readonly getSalesOrdersByDate?: GetSalesOrdersByDate;
    readonly shipmentCreated?: ShipmentCreated;
    readonly shipmentCancelled?: ShipmentCancelled;
  };

  public readonly type: AppType;

  public constructor(pojo: OrderAppPOJO) {
    validate(pojo, OrderApp);

    super(pojo);

    this.type = AppType.Order;

    this[_private] = {
      getSalesOrder: pojo.getSalesOrder ? pojo.getSalesOrder : (this.getSalesOrder = undefined),
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

  public async getSalesOrder?(transaction: TransactionPOJO, id: SalesOrderIdentifierPOJO): Promise<SalesOrder> {
    let _transaction, _id;
    let { getSalesOrder } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _id = new SalesOrderIdentifier(validate(id, SalesOrderIdentifier));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the getSalesOrder method.", { originalError });
    }

    try {
      let salesOrder = await getSalesOrder!(_transaction, _id);
      return new SalesOrder(validate(salesOrder, SalesOrder));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the getSalesOrder method.", { originalError, transactionID });
    }
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
      throw error(ErrorCode.AppError, "Error in the getSalesOrdersByDate method.", { originalError, transactionID });
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
      throw error(ErrorCode.AppError, "Error in the shipmentCreated method.", { originalError, transactionID });
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
      throw error(ErrorCode.AppError, "Error in the shipmentCancelled method.", { originalError, transactionID });
    }
  }
}
