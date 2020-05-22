import { AppType, ErrorCode, Transaction, TransactionPOJO } from "../common";
import { ConnectionApp, error, hideAndFreeze, Joi, localize, validate, _internal } from "../common/internal";
import { GetSalesOrder, GetSalesOrdersByDate, GetSeller, ShipmentCancelled, ShipmentCreated } from "./methods";
import { OrderAppPOJO } from "./order-app-pojo";
import { SalesOrder } from "./sales-order";
import { SalesOrderIdentifier } from "./sales-order-identifier";
import { SalesOrderTimeRange, SalesOrderTimeRangePOJO } from "./sales-order-time-range";
import { Seller } from "./sellers/seller";
import { SellerIdentifier, SellerIdentifierPOJO } from "./sellers/seller-identifier";
import { getAsyncIterable } from "./utils";

const _private = Symbol("private fields");

/**
 * A ShipEngine Integration Platform order app
 */
export class OrderApp extends ConnectionApp {
  //#region Private/Internal Fields

  /** @internal */
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

  /** @internal */
  private readonly [_private]: {
    readonly getSeller: GetSeller;
    readonly getSalesOrder: GetSalesOrder;
    readonly getSalesOrdersByDate: GetSalesOrdersByDate;
    readonly shipmentCreated?: ShipmentCreated;
    readonly shipmentCancelled?: ShipmentCancelled;
  };

  //#endregion
  //#region Public Fields

  /**
   * Indicates that this is an order app
   */
  public readonly type: AppType;

  //#endregion

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

    this[_internal].references.add(this);
    this[_internal].references.finishedLoading();
  }

  /**
   * Creates a copy of the app, localized for the specified locale if possible.
   */
  public localize(locale: string): OrderApp {
    let pojo = localize(this, locale);
    return new OrderApp(pojo);
  }

  /**
   * Returns the app as a POJO that can be safely serialized as JSON.
   * Optionally returns the POJO localized to the specifeid language and region.
   */
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

  //#region Wrappers around user-defined methdos

  /**
   * Returns detailed information about a seller
   */
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

  /**
   * Returns a specific sales order
   */
  public async getSalesOrder(transaction: TransactionPOJO, id: SalesOrderIdentifier): Promise<SalesOrder> {
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

  /**
   * Returns all orders that were created and/or modified within a given timeframe
   */
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

  /**
   * Called when a shipment is created for one or more items in one or more sales orders.
   *
   * A single shipment may contain items from multiple sales orders, and a single sales order
   * may be fulfilled by multiple shipments.
   */
  public async shipmentCreated?(transaction: TransactionPOJO): Promise<void> {
    let _transaction, _arg2;
    let { shipmentCreated } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      // _arg2 = new Arg2(validate(arg2, Arg2));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the shipmentCreated method.", { originalError });
    }

    try {
      await shipmentCreated!(_transaction);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the shipmentCreated method.", { originalError, transactionID });
    }
  }

  /**
   * Called when a shipment is cancelled for one or more items in one or more sales orders.
   *
   * A single shipment may contain items from multiple sales orders, and a single sales order
   * may be fulfilled by multiple shipments.
   */
  public async shipmentCancelled?(transaction: TransactionPOJO): Promise<void> {
    let _transaction, _arg2;
    let { shipmentCancelled } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      // _arg2 = new Arg2(validate(arg2, Arg2));
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the shipmentCancelled method.", { originalError });
    }

    try {
      await shipmentCancelled!(_transaction);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, "Error in the shipmentCancelled method.", { originalError, transactionID });
    }
  }

  //#endregion
}

// Prevent modifications to the class
hideAndFreeze(OrderApp);
