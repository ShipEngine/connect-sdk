import { AppType, ErrorCode, GetSalesOrder, GetSalesOrdersByDate, GetSeller, OrderApp as IOrderApp, OrderAppPOJO, SalesOrderIdentifierPOJO, SalesOrderShipmentPOJO, SalesOrderTimeRangePOJO, SellerIdentifierPOJO, ShipmentCancelled, ShipmentCreated, TransactionPOJO } from "../../public";
import { ConnectionApp, error, hideAndFreeze, Joi, localize, Transaction, validate, _internal } from "../common";
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
      getSeller: Joi.function().required(),
      getSalesOrder: Joi.function().required(),
      getSalesOrdersByDate: Joi.function().required(),
      shipmentCreated: Joi.function(),
      shipmentCancelled: Joi.function(),
    }),
  };

  private readonly [_private]: {
    readonly getSeller: GetSeller;
    readonly getSalesOrder: GetSalesOrder;
    readonly getSalesOrdersByDate: GetSalesOrdersByDate;
    readonly shipmentCreated?: ShipmentCreated;
    readonly shipmentCancelled?: ShipmentCancelled;
  };

  public readonly type: AppType;

  public constructor(pojo: OrderAppPOJO) {
    validate(pojo, OrderApp);

    super(pojo);

    this.type = AppType.Order;

    this[_private] = {
      getSeller: pojo.getSeller,
      getSalesOrder: pojo.getSalesOrder,
      getSalesOrdersByDate: pojo.getSalesOrdersByDate,
      shipmentCreated: pojo.shipmentCreated ? pojo.shipmentCreated : (this.shipmentCreated = undefined),
      shipmentCancelled: pojo.shipmentCancelled ? pojo.shipmentCancelled : (this.shipmentCancelled = undefined),
    };

    // Make this object immutable
    hideAndFreeze(this);

    this[_internal].references.finishedLoading();
  }

  public localize(locale: string): OrderApp {
    let pojo = localize(this, locale);
    return new OrderApp(pojo);
  }

  public toJSON(locale?: string): OrderAppPOJO {
    let methods = this[_private];

    return {
      ...super.toJSON(locale),
      getSeller: methods.getSeller,
      getSalesOrder: methods.getSalesOrder,
      getSalesOrdersByDate: methods.getSalesOrdersByDate,
      shipmentCreated: methods.shipmentCreated,
      shipmentCancelled: methods.shipmentCancelled,
    };
  }

  public async getSeller(transaction: TransactionPOJO, id: SellerIdentifierPOJO): Promise<Seller> {
    let _transaction, _id;
    let { getSeller } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _id = new SellerIdentifier(validate(id, SellerIdentifier));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the getSeller method.", { originalError });
    }

    try {
      let seller = await getSeller(_transaction, _id);
      return new Seller(validate(seller, Seller));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the getSeller method.", { originalError, transactionID });
    }
  }

  public async getSalesOrder(transaction: TransactionPOJO, id: SalesOrderIdentifierPOJO): Promise<SalesOrder> {
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
      let salesOrder = await getSalesOrder(_transaction, _id);
      return new SalesOrder(validate(salesOrder, SalesOrder));
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the getSalesOrder method.", { originalError, transactionID });
    }
  }

  public async* getSalesOrdersByDate(
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
      let salesOrders = await getSalesOrdersByDate(_transaction, _range);
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
